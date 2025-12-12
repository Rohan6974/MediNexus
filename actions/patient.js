"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updatePatientSeverity(severity) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "PATIENT") {
    throw new Error("Only patients can update severity");
  }

  try {
    await db.user.update({
      where: { clerkUserId: userId },
      data: { severity },
    });

    revalidatePath("/patient/settings");
    revalidatePath("/appointments");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update severity:", error);
    return { success: false, error: "Failed to update severity" };
  }
}

export async function getPatientSeverity() {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { severity: true, role: true }
    });
  
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "PATIENT") {
        throw new Error("User is not a patient");
    }
  
    return { severity: user.severity };
}

export async function getPatientAppointments() {
    const {userId} = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role:"PATIENT"
            },
            select: {
                id: true
            }
        
        })

        if(!user){
            throw new Error("User not found");
        }

        const appointments = await db.appointment.findMany({
            where: {
                patientId: user.id,
                
            },
            include:{
                doctor:{
                    select:{
                        id:true,
                        name:true,
                        specialty:true,
                        imageUrl:true
                    }
                }
            },
            orderBy:{
                startTime:"asc"
            }
        })
        
        return {appointments}
    } catch (error) {
        throw new Error(error.message);
        
    }
}