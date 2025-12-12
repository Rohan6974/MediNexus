"use server";


import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointments } from "./credits";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";
import { db } from "@/lib/prisma";

const credentials = new Auth({
    applicationId:process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
    privateKey:process.env.NEXT_VONAGE_PRIVATE_KEY
})

const vonage = new Vonage(credentials)
export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return { doctor };
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    throw new Error("Failed to fetch doctor details");
  }
}

export async function getAvailableTimeSlots(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No available time slots");
    }

    const now = new Date();
    const days = [
      now,
      addDays(now, 1),
      addDays(now, 2),
      addDays(now, 3),
      addDays(now, 4),
      addDays(now, 5),
      addDays(now, 6),
    ];

    const lastDay = endOfDay(days[6]);

    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        startTime: {
          lte: lastDay,
        },
        status: "SCHEDULED",
      },
    });

    const availableSlotsByDays = {};

    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDays[dayString] = [];

      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 60), end) ||
        +addMinutes(current, 60) === +end
      ) {
        const next = addMinutes(current, 60);

        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const start = new Date(appointment.startTime);
          const end = new Date(appointment.endTime);

          return (
            (current >= start && current < end) ||
            (next > start && next <= end) ||
            (current <= start && next >= end)
          );
        });

        if (!overlaps) {
          availableSlotsByDays[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formated: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE,MMMM d"),
          });
        }
        current = next;
      }
    }
    const result = Object.entries(availableSlotsByDays).map(
      ([date, slots]) => ({
        date,
        displayDate:
          slots.length > 0
            ? slots[0].day
            : format(new Date(date), "EEEE,MMMM d"),
        slots,
      })
    );

    return { days: result };
  } catch (error) {
    throw new Error("Failed to get doctor", error);
  }
}

export async function bookAppointment(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const doctorId = formData.get("doctorId");
    const startTime = formData.get("slotId");
    const endTime = formData.get("endTime");
    const diseases = formData.get("diseases");
    const patientDescription = formData.get("description") || null;

    if (!doctorId || !startTime || !endTime) {
      throw new Error("Missing required fields");
    }

    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    if (patient.credits < 2) {
      throw new Error("Insufficient credits");
    }

    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("Overlapping appointment");
    }

    let sessionId = null;
    if (patient.severity !== "SEVERE") {
      sessionId = await createVideoSession();
    }

    const { success, error } = await deductCreditsForAppointments(
      patient.id,
      doctor.id
    );
    if (!success) throw new Error(error);

    const appointment = await db.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        diseases,
        patientDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId,
      },
    });

    console.log("Appointment created", appointment);

    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error(error);
   ;
  }
}

async function createVideoSession(){

  try {
    const session = await vonage.video.createSession({mediaMode:"routed"})
    return session.sessionId
  
  } catch (error) {

    throw new Error("Failed to create video session", error || error.message);
    
  }



}

export async function generateVideoToken(formData){
   const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");


  try {
    const user = await db.user.findUnique({
      where:{
        clerkUserId:userId
      }
    })

    if(!user){
      throw new Error("User not found")
    } 

    const appointmentId = formData.get("appointmentId");

    const appointment = await db.appointment.findUnique({
      where:{
        id:appointmentId
      }
    })

    if(!appointment){
      throw new Error("Appointment not found")
    }

    if(appointment.doctorId !== user.id && appointment.patientId !== user.id){
      throw new Error("you are not authorized to join the call")
    }

    if(appointment.status !== "SCHEDULED"){
      throw new Error("Appointment is not scheduled")
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.startTime)
    const timeDifference = (appointmentTime-now) / (1000 * 60) 

    if(timeDifference > 60){
      throw new Error("You can only join the call 1 hour during the appointment time")
    }


    const appointmentEndTime = new Date(appointment.endTime)
    const expirationTime = Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60  

    const connectionData = JSON.stringify({
      name:user.name,
      role:user.role,
      userId:user.id
    })

    const token = vonage.video.generateClientToken(appointment.videoSessionId,{
      role:"publisher",
      expireTime:expirationTime,
      data:connectionData
    })

    await db.appointment.update({
      where:{
        id:appointmentId
      },
      data:{
        videoSessionToken:token
      }
    })

    return{
      success:true,
      videoSessionId:appointment.videoSessionId,
      token:token
    }
  } catch (error) {
    throw new Error("Failed to generate video token", error || error.message);
  }
   
}