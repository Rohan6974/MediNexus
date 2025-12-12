import { getCurrentUser } from '@/actions/onboarding'
import { getPatientAppointments } from '@/actions/patient'
import AppointmentCard from '@/components/appointment-card'
import PageHeader from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const PatientAppointmentPage = async () => {
  const user = await getCurrentUser()
  if (!user || user.role !== "PATIENT") return redirect("/onboarding")

  const { appointments, error } = await getPatientAppointments()
  return (
    <div className='container mx-auto px-4 py-8'>
      <PageHeader icon={<Calendar />} title="Appointments" backlink='/doctors' backlabel='Find Doctors' />
      {error ? (
        <div className='text-center py-8'>
          <p className='text-red-400'>Error:{error}</p>
        </div>
      ) : appointments?.length > 0 ? (
        <div className='space-y-4'>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              useRole="PATIENT"
            />
          ))}

        </div>
      ) : (
        <div className='text-center py-8'>
          <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
          <h3 className='text-lg font-medium text-white mb-2'>
            No appointments scheduled
          </h3>
          <p className='text-muted-foreground'>
            you do not have any appointments scheduled yet. Browse our doctors and book your first consultation
          </p>
        </div>
      )}

    </div>
  )
}

export default PatientAppointmentPage