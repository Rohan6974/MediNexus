import { verifyAdmin } from "@/actions/admin";
import PageHeader from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ShieldCheck, User2Icon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Admin Dashboard - Medinexus",
  description: "Manage your doctors and patients",
};

const AdminLayout = async ({ children }) => {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/onboarding");
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader icon={<ShieldCheck />} title="Admin Dashboard" />

      <Tabs
        defaultValue="pending"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            className="flex-1 md:flex md:items-center md:justify-start md:px-4   md:py-3 w-full"
            value="pending"
          >
            <AlertCircle className="h-4 w-4 mr-3 hidden md:inline " />
            <span>Pending Verification</span>{" "}
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
            value="doctors"
          >
            <User2Icon className="h-4 w-4 mr-3 hidden md:inline " />
            <span>Doctors</span>
          </TabsTrigger>
        </TabsList>

        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  );
};

export default AdminLayout;
