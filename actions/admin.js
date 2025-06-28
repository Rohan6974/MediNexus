"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Failed to verify admin:", error);
    return false;
  }
}

export async function getPendingDoctors() {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  try {
    const pendingDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { doctors: pendingDoctors };
  } catch (error) {
    console.log("Failed to Fetch Doctors", error);
  }
}

export async function getVerifiedDoctors() {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  try {
    const verifiedDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { doctors: verifiedDoctors };
  } catch (error) {
    console.log("Failed to Fetch Doctors", error);
  }
}

export async function updateDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Missing required fields");
  }

  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update Doctor Status", error);
    throw new Error("Failed to update Doctor Status", error || error.message);
  }
}

export async function updateDoctorActiveStatus(fromData) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }
  const doctorId = fromData.get("doctorId");
  const suspend = fromData.get("suspend") === "true";

  try {
    const status = suspend ? "PENDING" : "VERIFIED";
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update Doctor Status", error);
    throw new Error("Failed to update Doctor Status", error || error.message);
  }
}
