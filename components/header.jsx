import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { CheckUser } from "@/lib/checkUser";
import {
  Calendar,
  CreditCard,
  ShieldCheckIcon,
  Stethoscope,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { checkAndAllocateCredits } from "@/actions/credits";

const Header = async () => {
  const user = await CheckUser();
   if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/">
          <Image
            src={"/Medical Logo with Stethoscope Design.png"}
            alt="MediNexus"
            width={600}
            height={100}
            className="h-18 w-auto object-contain"
          />
        </Link>

        <Link href="/">
          <Image
            src={"/MediNexus Logo Design.png"}
            alt="MediNexus"
            width={800}
            height={300}
            className="h-40 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-2">
          <SignedIn>
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex cursor-pointer items-center gap-4"
                >
                  <ShieldCheckIcon className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <ShieldCheckIcon className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex cursor-pointer items-center gap-4"
                >
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Doctor Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {user?.role === "PATIENT" && (
              <Link href="/appointment">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex cursor-pointer items-center gap-4"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  My Appointment
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex cursor-pointer items-center gap-4"
                >
                  <User className="mr-2 h-4 w-4" />
                  Complete Profile
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </SignedIn>
          {(!user || user?.role === "PATIENT") && (
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {user && user?.role === "PATIENT" ? (
                  <>
                  {user.credits }
                  <span className="hidden md:inline" >Credits</span> 
                  </>
                ) : <>Pricing</>}
                </span>
              </Badge>
            </Link>
          )}
          <SignedOut>
            <SignInButton>
              <Button variant="secondary" className="mr-5 cursor-pointer">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="mr-5">
              {" "}
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
