"use client"
import { bookAppointment } from '@/actions/appointments'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { SPECIALTIES } from '@/lib/specialties'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, CreditCard, Dot, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'


const AppointmentForm = ({ doctorId, slot, onBack, onComplete, specialty }) => {
  const [description, setDescription] = useState("")
  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);
  const [disease, setDisease] = useState("")

  const selectedSpecialty = SPECIALTIES.find((spec) => spec.name === specialty);
  const diseases = selectedSpecialty?.diseases || [];

  const handleBooking = async(e) =>{
    e.preventDefault();

    const formData = new FormData();

    formData.append("doctorId", doctorId);
    formData.append("slotId", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("diseases", disease);
    formData.append("description", description);

    await submitBooking(formData);
  }

  useEffect(() => {
    if (data) {
      if(data.success){
        toast.success("Appointment Booked Successfully");
        onComplete()
      }
    }
  }, [data]);

 
  return (
    <form className='space-y-6' onSubmit={handleBooking}>
      <div className='bg-muted/20 p-4 rounded-lg border border-emerald-900/90 space-y-3'>
        <div className='flex items-center'>
          <Calendar className='h-4 w-4 mr-2 text-emerald-400' />
          <span className='text-white font-medium'>
            {format(new Date(slot.startTime), "EEEE, MMMM dd, yyyy")}
          </span>
        </div>
        <div className='flex items-center'>
          <Clock className='h-4 w-4 mr-2 text-emerald-400' />
          <span className='text-white'>
            {slot.formated}
          </span>
        </div>

        <div className='flex items-center'>
          <CreditCard className='h-4 w-4 mr-2 text-emerald-400' />
          <span className='text-muted-foreground'>
            Cost: <span className='text-white font-medium' >2 Credits</span>
          </span>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor="disease" className="text-emerald-500">Select Disease</Label>
          <Select value={disease} onValueChange={setDisease}>
            <SelectTrigger id="disease">
              <SelectValue placeholder="Select Disease" />
            </SelectTrigger>
            <SelectContent>
              {diseases.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-4'>
          <Label htmlFor="description" className="text-emerald-500">Description</Label>
          <Textarea
            id="description"
            placeholder="Please provide any details about your medical concern or what you like discuss in the appointment..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-emerald-600/90 h-32"
          />
          <p className='text-sm text-muted-foreground'>
            This information will be shared with the doctor before your appointment
          </p>
        </div>
      </div>

      <div className='flex justify-between'>
        <Button type="button" variant={"outline"} onClick={onBack} disabled={loading} className="border-emerald-900/30">
          <ArrowLeft className="mr-2 h-4 w-4" /> Change Time Slot
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>

    </form>
  )
}

export default AppointmentForm