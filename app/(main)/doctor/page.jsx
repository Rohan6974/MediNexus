import { getDoctorAppointments, getDoctorAvailability } from '@/actions/doctors';
import { getCurrentUser } from '@/actions/onboarding'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Calendar, User2Icon } from 'lucide-react';
import React from 'react'
import AvailabilitySetting from './_components/availability-setting';
import AppointmentList from './_components/apoointment-list';

const DoctorDashboard = async () => {

  const user = await getCurrentUser()

  const [appointmentData, availabilityData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorAvailability(),
  ]);

  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  if (user?.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  return (
    <Tabs
      defaultValue="appointment"
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
        <TabsTrigger
          className="flex-1 md:flex md:items-center md:justify-start md:px-4   md:py-3 w-full"
          value="appointment"
        >
          <Calendar className="h-4 w-4 mr-3 hidden md:inline " />
          <span>Appointment</span>
        </TabsTrigger>
        <TabsTrigger
          className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          value="availability"
        >
          <User2Icon className="h-4 w-4 mr-3 hidden md:inline " />
          <span>Availability</span>
        </TabsTrigger>
      </TabsList>

      <div className="md:col-span-3"> 
        <TabsContent value="appointment" className="border-none p-0">
          <AppointmentList appointments={appointmentData.appointments || []} />
        </TabsContent>
        <TabsContent value="availability" className="border-none p-0">
          <AvailabilitySetting slots={availabilityData.slots || []} />
        </TabsContent>
      </div>

    </Tabs>
  )
}

export default DoctorDashboard