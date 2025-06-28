import { getPendingDoctors, getVerifiedDoctors } from "@/actions/admin";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import PendingDoctors from "./_components/pending-doctors";
import VerifiedDoctors from "./_components/verified-doctors";

const AdminPage = async () => {
  const [getPendingDoctorsData, getVerifiedDoctorsData] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
  ]);
  return (
    <>
      <TabsContent value="pending">
        <PendingDoctors doctors={getPendingDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="doctors">
        <VerifiedDoctors doctors={getVerifiedDoctorsData.doctors || []} />
      </TabsContent>
    </>
  );
};

export default AdminPage;
