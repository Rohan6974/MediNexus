"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

const CREDIT_PLAN = {
  free_user: 0,
  standard: 10,
  premium: 24,
};

const APPOINTMENTS_CREDIT_COST = 2;

export const checkAndAllocateCredits = async (user) => {
  try {
    if (!user) {
      return null;
    }

    if (user?.role !== "PATIENT") {
      return user;
    }

    const { has } = await auth();

    const hasbasic = has({ plan: "free_user" });
    const hasstandard = has({ plan: "standard" });
    const haspremium = has({ plan: "premium" });

    let currentPlan = null;
    let creditsToAllocate = 0;

    if (haspremium) {
      (currentPlan = "premium"), (creditsToAllocate = CREDIT_PLAN.premium);
    } else if (hasstandard) {
      (currentPlan = "standard"), (creditsToAllocate = CREDIT_PLAN.standard);
    } else if (hasbasic) {
      (currentPlan = "free_user"), (creditsToAllocate = CREDIT_PLAN.free_user);
    }

    if (!currentPlan) {
      return user;
    }

    const currentMonth = format(new Date(), "yyyy-MM");


    if (user.transactions.length > 0) {
      const latestTransaction = user.transactions[0];
      const transactionMonth = format(
        new Date(latestTransaction.createdAt),
        "yyyy-MM"
      );

      const trnsactionPlan = latestTransaction.packageId;

      if (transactionMonth === currentMonth && trnsactionPlan === currentPlan) {
        return user;
      }
    }

    const updatedUser = await db.$transaction(async (tx) => {
      await tx.CreditTransaction.create({
        data: {
          userId: user.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });
      const updatedUser = await tx.User.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: creditsToAllocate,
          },
        },
      });

      return updatedUser;
    });

    revalidatePath("/doctors");
    revalidatePath("/appointments");
  } catch (error) {
    console.log(error.message);
  }
};

