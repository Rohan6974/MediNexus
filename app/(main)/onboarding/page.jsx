"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldAlertIcon, ShieldBan, Stethoscope, User } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { setUserRole } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialties";
import { Input } from "@/components/ui/input";
import axios from "axios";

const OnboardingPage = () => {
  const doctorFormSchema = z.object({
    specialty: z.string().min(1, "Specialty is required"),
    experience: z
      .number()
      .min(1, "Minimum 1 year experience is required")
      .max(20, "Maximum 20 years experience is required"),
    credentialUrl: z
      .string()
      .url("Please enter a valid url")
      .min(1, "Credential url is required"),
    description: z
      .string()
      .min(50, "Minimum 50 characters Description is required")
      .max(1000, "Description must be less than 1000 characters"),
  });
  const [step, setStep] = useState("choose-role");

  const router = useRouter();

  const { data, fn: submitUserRole, loading } = useFetch(setUserRole, );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const {
    register: adminRegister,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const specialtyValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
      toast.success("Role set successfully");
    }
  }, [data]);

  const onDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();

    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  const onAdminSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();

    formData.append("role", "ADMIN");
    formData.append("email", data.email);
    formData.append("password", data.password);

    await submitUserRole(formData);

  }

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card
          onClick={() => !loading && handlePatientSelection()}
          className="border-emerald-700/20 hover:border-emerald-700/90 cursor-pointer transition-all"
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-800/90 rounded-full mb-6">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold text-fuchsia-100 mb-2 ">
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-5 text-muted-foreground">
              Book Appointment, consult a doctor and manage your healthcare.
            </CardDescription>
            <Button
              disabled={loading}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-800/80"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Join as a Patient"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          onClick={() => !loading && setStep("doctor-from")}
          className="border-emerald-700/20 hover:border-emerald-700/90 cursor-pointer transition-all"
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-800/90 rounded-full mb-6">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold text-fuchsia-100 mb-2 ">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-5 text-muted-foreground">
              Create your professional profile, manage your patients and set
              your availability.
            </CardDescription>
            <Button
              disabled={loading}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-800/80"
            >
              Join as a Doctor
            </Button>
          </CardContent>
        </Card>
        <Card
          onClick={() => !loading && setStep("admin-from")}
          className="border-emerald-700/20 hover:border-emerald-700/90 cursor-pointer transition-all"
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-800/90 rounded-full mb-6">
              <ShieldAlertIcon className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold text-fuchsia-100 mb-2 ">
              Join as a Admin
            </CardTitle>
            <CardDescription className="mb-5 text-muted-foreground">
              Manage your Patients and doctors and set their availability
            </CardDescription>
            <Button
              disabled={loading}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-800/80"
            >
              Join as a Admin
            </Button>
          </CardContent>
        </Card>


      </div>
    );
  }

  if (step === "admin-from") {
    return (
      <div className="pl-48">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className={"text-emerald-500"}>Login to admin account</CardTitle>
            <CardDescription className={"text-muted-foreground"}>
              Enter your email below to login to admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSubmit(onAdminSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...adminRegister("email")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required {...adminRegister("password")} />
                </div>
              </div>

              <CardFooter className="flex-col pt-8 gap-2">
                <Button disabled={loading} type="submit" className="w-full bg-emerald-400 hover:bg-emerald-600">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    "Login as Admin"
                  )}
                </Button>
              </CardFooter>

            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "doctor-from") {
    return (
      <Card className="border-emerald-700/20 hover:border-emerald-700/90 transition-all">
        <CardContent className="pt-6 ">
          <div className="mb-6 ">
            <CardTitle className="text-2xl font-bold text-fuchsia-100 mb-2 ">
              Complete your Doctor Profile
            </CardTitle>
            <CardDescription>
              Please provide your professional details for us to verify your
              profile.
            </CardDescription>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onDoctorSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) => setValue("specialty", value)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => {
                    return (
                      <SelectItem key={spec.name} value={spec.name}>
                        <div className="flex items-center gap-5">
                          <span className=" rounded-full p-2">
                            {spec.icon}
                          </span>
                          {spec.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.specialty && toast.error(errors.specialty.message)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Year of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Enter Experience"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && toast.error(errors.experience.message)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">
                Link to credentials Document{" "}
              </Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="http://example.com/my-medical-degree"
                {...register("credentialUrl")}
              />
              <p className="text-sm text-muted-foreground">
                {errors.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Please provide a link to your medical degree or credentials.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of your specialty</Label>
              <Input
                id="description"
                type="text"
                placeholder="Describe your expertise, services, approach to patient care"
                rows="4"
                {...register("description")}
              />
              <p className="text-sm text-muted-foreground">
                {errors.description}
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => setStep("choose-role")}
                className="bg-muted-foreground"
              >
                Back
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className=" bg-emerald-600 hover:bg-emerald-800/80"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
};

export default OnboardingPage;
