import { getCurrentUser } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/prisma";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardCheck,
  Dot,
  DotIcon,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const VerificationPage = async () => {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }
  const isRejected = user?.verificationStatus === "REJECTED";
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-600/90 ">
          <CardHeader className="text-center">
            <div
              className={`mx-auto p-4 ${
                isRejected ? "bg-red-900/20" : "bg-amber-900/20"
              } rounded-full mb-7 w-fit`}
            >
              {isRejected ? (
                <XCircle className="h-8 w-8 text-red-600" />
              ) : (
                <ClipboardCheck className="h-8 w-8 text-amber-500" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              {isRejected
                ? "Verification Rejected"
                : "Verification in Progress"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isRejected
                ? "Your verification request has been rejected. Please try again."
                : "Thank you for submitting your verification request."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRejected ? (
              <div className="bg-red-900/20 border border-red-900/2- rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0 " />

                <div className="text-muted-foreground text-left">
                  <p className="mb-2">
                    Our administrative team has reviewed your application and
                    found that it doesn&apos;t meet our current requirements.
                    Common reasons for rejection include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Insufficient or unclear credential documentation</li>
                    <li>Professional experience requirements not met</li>
                    <li>Incomplete or vague service description</li>
                  </ul>
                  <p>
                    You can update your application with more information and
                    resubmit for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/20 border border-amber-900/2- rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0 " />
                <p className="text-muted-foreground text-left">
                  Our administrative team is currently reviewing your
                  application. This process typically takes 1-2 business days.
                  you will receive an email notification once your account is
                  verified.
                </p>
              </div>
            )}{" "}
            <p className="text-muted-foreground mb-7">
              {isRejected
                ? "You can update your profile and resubmit for verification"
                : "While you wait, you can familiarize yourself with our services and features."}
            </p>
            {isRejected ? (
              <div className=" flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="primary"
                  className={
                    "bg-red-700 border-red-700 hover:bg-red-600 hover:border-red-600"
                  }
                >
                  <Link href="/onboarding">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Resubmit Application
                  </Link>
                </Button>
              </div>
             
            ) : (
              <div className=" flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="outline"
                  className={
                    "bg-emerald-700 border-emerald-700 hover:bg-emerald-600 hover:border-emerald-600"
                  }
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
