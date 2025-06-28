import PageHeader from "@/components/page-header";
import { Stethoscope } from "lucide-react";
import React from "react";

export const metadata = {
  title: "Doctor Dashboard - Medinexus",
  description: "Manage your appointments and patients",
};

const DoctorDashboardLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />
      {children}
    </div>
  );
};

export default DoctorDashboardLayout;
