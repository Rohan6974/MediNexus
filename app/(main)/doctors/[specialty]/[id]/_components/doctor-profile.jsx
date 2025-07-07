"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, ChevronDown, ChevronUp, Clock, FileText, Medal, User } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import AppointmentForm from './appointment-form'
import { useRouter } from 'next/navigation'
import SlotPicker  from './slot-picker'

const DoctorProfile = ({ doctor, availableDays }) => {

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState(null)
  const router = useRouter()

  const handleSelectSlot = (slot) => {
    setSelectedSlots(slot)
  }

  const totalSLots = availableDays.reduce((total, day) => total + day.slots.length, 0)

  const toggleBooking = () => {
    setShowBookingForm(!showBookingForm)

    if (!showBookingForm) {
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({
          behavior: "smooth"
        })
      }, 100)
    }
  }

  const handleBookingComplete = ()=>{
    router.push("/appointments")

  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

      <div className='md:col-span-1'>
        <div className='md:sticky md:top-24'>
          <Card className="border-emerald-600/90">
            <CardContent className="pt-6">
              <div className='flex flex-col items-center text-center'>
                <div className='relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-emerald-800/90'>
                  {doctor.imageUrl ? (
                    <Image src={doctor.imageUrl} alt={doctor.name} width={128} height={128} className='object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <User className='h-16 w-16 text-emerald-400' />
                    </div>
                  )}
                </div>

                <h2>
                  Dr. {doctor.name}
                </h2>

                <Badge variant={"outline"} className="bg-emerald-900/80 border-emerald-700/90 text-emerald-400 mb-4">
                  {doctor.specialty}
                </Badge>

                <div className='flex items-center justify-center mb-2'>
                  <Medal className='h-4 w-4 text-emerald-400 mr-2' />
                  <span className='text-muted-foreground'>
                    {doctor.experience} years of experience
                  </span>
                </div>
                <Button onClick={toggleBooking} className="w-full bg-emerald-600 hover:bg-emerald-800/90 mt-4">
                  {
                    showBookingForm ? <><ChevronUp className='h-4 w-4 ml-2 ' /> Hide Booking</> : <><ChevronDown className='h-4 w-4 ml-2' /> Book an Appointment</>
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      <div className='md:col-span-2 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white"> About Dr. {doctor.name}</CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>

          </CardHeader>
          <CardContent className="space-y-4">

            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <FileText className="h-6 w-6 text-emerald-400" />
                <h3 className='text-white font-medium'>
                  Description
                </h3>
              </div>
              <p className='text-muted-foreground whitespace-pre-line'>
                {doctor.description}
              </p>
            </div>

            <Separator className="bg-emerald-500/90" />

            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Clock className="h-6 w-6 text-emerald-400 mr-2" />
                <h3 className='text-white font-medium'>
                  Availability
                </h3>
              </div>
            </div>

            {totalSLots > 0 ? (
              <div>
                <Calendar className="h-6 w-6 text-emerald-400 mr-2" />
                <p className='text-muted-foreground'>{totalSLots} times slots available for over the next 7 days</p>
              </div>
            ) : (
              <div>
                <Alert className="mt-2 border-emerald-600/90">
                  <AlertDescription className="text-muted-foreground">
                    No available slots for the next 7 days. Please check back later.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {showBookingForm && (
          <div id='booking-section'>
            <Card className="border-emerald-600/90">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Book a Appointment</CardTitle>
                <CardDescription>Select a time slot and provide details for your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                {
                  totalSLots > 0 ? (
                    <>
                      {!selectedSlots && <SlotPicker days={availableDays} onSelectSlot={handleSelectSlot} />}
                      {selectedSlots && <AppointmentForm doctorId={doctor.id} slot={selectedSlots} onBack={() => setSelectedSlots(null)} specialty={doctor.specialty} onComplete={handleBookingComplete} />}
                    </>
                  ) : (
                    <div className='text-center py-6'>
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className='text-lg font-medium text-white mb-2'>No available slots</h3>
                      <p className='text-muted-foreground'>
                        This doctor does not have any available appointment slots for next 7 days. Please check back later or try another doctor
                      </p>
                    </div>
                  )
                }
              </CardContent>

            </Card>
          </div>
        )}
      </div>

    </div>
  )
}

export default DoctorProfile