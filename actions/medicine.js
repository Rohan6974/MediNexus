"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";

export async function getAllMedicines() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const medicines = await db.medicine.findMany({});
    return { medicines };
  } catch (error) {
    toast.error(error.message);
  }
}

export async function addMedicine(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const doctor = await db.user.findUnique({
    where: {
      clerkUserId: userId,
      role: "DOCTOR",
    },
  });

  if (!doctor) {
    throw new Error("Unauthorized");
  }

  try {
    const medicine = await db.medicine.create({
      data: {
        name: formData.get("name"),
        price: parseInt(formData.get("price"), 10),
        imageUrl: formData.get("imageUrl"),
        dosage: formData.get("dosage"),
        description: formData.get("description"),
        specialty: doctor.specialty,
      },
    });
    return { medicine };
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getMedicineBySpecialty(specialty){
  const {userId} = await auth();
  if(!userId){
    throw new Error("Unauthorized");
  }

  try {
    const medicines = await db.medicine.findMany({
      where: {
         specialty:specialty.split("%20").join(" ")
      },
    });
    return { medicines };
  } catch (error) {
    throw new Error(error.message);
  }

}