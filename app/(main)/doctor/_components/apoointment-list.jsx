import AppointmentCard from '@/components/appointment-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import React from 'react'

const AppointmentList = ({ appointments }) => {
    return (
        <Card className="border-emerald-600/90">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center">
                    <Calendar className='h-4 w-4 mr-2 text-emerald-400' />
                    Upcoming Appointments
                </CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length > 0 ? (
                    <div className='space-y-4'>
                        {appointments.map((appointment) => (
                            <AppointmentCard 
                                key={appointment.id}
                                appointment={appointment} 
                                useRole="DOCTOR"
                            />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-8 '>
                        <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                        <h3 className='text-lg font-bold text-white mb-2'>
                            No Upcoming Appointment
                        </h3>
                        <p className='text-muted-foreground'>
                            you do not have any scheduled appointments yet. Make sure you have set your availabilityto allow patient to book
                        </p>
                    </div>
                )}
            </CardContent>

        </Card>
    )
}

export default AppointmentList