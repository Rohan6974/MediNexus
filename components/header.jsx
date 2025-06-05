import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
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
          <Image src={"/MediNexus Logo Design.png"} alt="MediNexus" width={800} height={300} className="h-40 w-auto object-contain" />
        </Link>

        <div className="flex items-center space-x-2">
          <SignedOut>
              <SignInButton  >
                <Button variant="secondary" className="mr-5 cursor-pointer">Sign In</Button>
              </SignInButton>
             
            </SignedOut>
            <SignedIn>
              <div className="mr-5"> <UserButton /></div>
             
            </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
