import { getPendingDoctors, getPendingPayouts, getVerifiedDoctors } from "@/actions/admin";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import PendingDoctors from "./_components/pending-doctors";
import VerifiedDoctors from "./_components/verified-doctors";
import {PendingPayouts} from "./_components/pending-payouts";

const AdminPage = async () => {
  const [getPendingDoctorsData, getVerifiedDoctorsData, pendingPayoutsData] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getPendingPayouts(),
  ]);
  return (
    <>
    
      <TabsContent value="pending">
        <PendingDoctors doctors={getPendingDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="doctors">
        <VerifiedDoctors doctors={getVerifiedDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="payouts">
        <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
      </TabsContent>
    </>
  );
};

export default AdminPage;
