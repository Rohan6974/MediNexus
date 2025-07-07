"use client"

import { generateVideoToken } from '@/actions/appointments';
import { addAppointmentNotes, cancelAppointment, markAppointmentCompleted } from '@/actions/doctors';
import useFetch from '@/hooks/use-fetch';
import { Calendar, CheckCircle, Clock, Edit, Loader, Loader2, Pencil, Stethoscope, User, Video, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { format } from 'date-fns';
import { date } from 'zod';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

const AppointmentCard = ({ appointment, useRole }) => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [notes, setNotes] = useState(appointment.notes || '');
    const router = useRouter()

    //API Calls

    const { loading: cancelLoading, fn: submitCancel, data: cancelData } = useFetch(cancelAppointment)
    const { loading: notesLoading, fn: submitNotes, data: notesData } = useFetch(addAppointmentNotes)
    const { loading: tokenLoading, fn: submitTokenRequest, data: tokenData } = useFetch(generateVideoToken)
    const { loading: completeLoading, fn: submitMarkCompleted, data: completeData } = useFetch(markAppointmentCompleted)

    //Other Parties

    const otherParty = useRole === "DOCTOR" ? appointment.patient : appointment.doctor;
    const otherPartyLabel = useRole === "DOCTOR" ? "Patient" : "Doctor";
    const otherPartyIcon = useRole === "DOCTOR" ? <User /> : <Stethoscope />

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy 'at' hh:mm a");
        } catch (error) {
            return "Invalid Date";
        }
    }

    const formatTime = (dateString) => {
        try {
            return format(new Date(dateString), "h:mm a");
        } catch (error) {
            return "Invalid Date";
        }
    }


    const onMarkComplete = () => {
        if (useRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
            return false
        }

        const now = new Date()
        const appointmentEndTime = new Date(appointment.endTime)
        return now >= appointmentEndTime
    }

    const handleMarkCompleted = async () => {
        if (completeLoading) return false

        if (window.confirm("Are you sure you want to mark this appointment as completed?")) {
            const formData = new FormData()
            formData.append('appointmentId', appointment.id)

            await submitMarkCompleted(formData)
        }
    }

    useEffect(() => {
        if (completeData?.success) {
            toast.success("Appointment Marked as Completed");
            setOpen(false)
        }
    }, [completeData])

    const isAppointmentActive = () => {
        const now = new Date()
        const appointmentTime = new Date(appointment.startTime)
        const appointmentEndTime = new Date(appointment.endTime)


        return (
            (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 && now <= appointmentTime) ||
            (now >= appointmentTime && now <= appointmentEndTime)
        )
    }
    const handleJoinVideoCall = async () => {
        if (tokenLoading) return false

        setAction("video")

        const formData = new FormData()
        formData.append('appointmentId', appointment.id)
        await submitTokenRequest(formData)
    }

    useEffect(() => {
        if (tokenData?.success) {
            router.push(`/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`)
        }

    }, [tokenData, appointment.id])

    const handleSaveNotes = async()=>{
        if(notesLoading || useRole !== "DOCTOR") return false

        const formData = new FormData()
        formData.append('appointmentId', appointment.id)
        formData.append('notes', notes)
        await submitNotes(formData)
    }

    useEffect(()=>{
        if(notesData?.success){
            toast.success("Notes Saved")
            setAction(null)
        }
    },[notesData])

    const handleCancelAppointment = async () => {
        if (cancelLoading) return false

        if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
            const formData = new FormData()
            formData.append('appointmentId', appointment.id)

            await submitCancel(formData)
        }
    }

    useEffect(() => {
        if (cancelData?.success) {
            toast.success("Appointment Cancelled Successfully");
            setOpen(false)
        }
    }, [cancelData])


    return (
        <>
            <Card className="border-emerald-600/60 hover:border-emerald-700/20 transition-all">
                <CardContent className="p-4">
                    <div className='flex flex-col md:flex-row justify-between gap-4'>
                        <div className='flex items-start gap-3'>
                            <div className='bg-muted/20 rounded-full p-2 mt-1'>
                                {otherPartyIcon}
                            </div>
                            <div>
                                <h3 className='font-medium text-emerald-400'>
                                    {useRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}
                                </h3>

                                {useRole === "DOCTOR" && (
                                    <p className='text-sm text-muted-foreground'>
                                        {otherParty.email}
                                    </p>
                                )}

                                {useRole === "PATIENT" && (
                                    <p className='text-sm text-muted-foreground'>
                                        {otherParty.specialty}
                                    </p>
                                )}
                                <div className='flex items-center mt-2 text-sm text-muted-foreground'>
                                    <Calendar className='h-4 w-4 mr-1' />
                                    <span>{formatDateTime(appointment.startTime)}</span>
                                </div>

                                <div className='flex items-center mt-2 text-sm  text-emerald-400'>
                                    <Clock className='h-4 w-4 mr-1' />
                                    <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2 self-end md:self-start'>
                            <Badge
                                variant={"outline"}
                                className={
                                    appointment.status === "COMPLETED"
                                        ? "bg-emerald-900/90 border-emerald-800/60 text-emerald-400"
                                        : appointment.status === "CANCELLED"
                                            ? "bg-red-900/90 border-red-800/60 text-red-400"
                                            : "bg-amber-900/90 border-amber-800/60 text-amber-400"
                                }
                            >{appointment.status}</Badge>

                            <div className='flex gap-2 mt-2 flex-wrap'>
                                {onMarkComplete && (
                                    <Button onClick={handleMarkCompleted} disabled={completeLoading} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                        {completeLoading ? (
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        ) : (
                                            <>
                                                <CheckCircle className='h-4 w-4 mr-1' />
                                                Complete
                                            </>
                                        )}
                                    </Button>
                                )}

                                <Button variant={"outline"} onClick={() => setOpen(true)} size="sm" className="border-emerald-600/90 ">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-emerald-400">Appointment Details</DialogTitle>
                        <DialogDescription>
                            {appointment.status === "SCHEDULED"
                                ? "Manage your upcoming apppointment"
                                : "View appointment information"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className='space-y-1 py-1'>
                        <div className='space-y-2'>
                            <h4 className='text-sm text-muted-foreground font-medium'>
                                {otherPartyLabel}
                            </h4>
                            <div className='flex items-center'>
                                <div className='h-5 w-5 text-emerald-400 mr-2'>
                                    {otherPartyIcon}
                                </div>
                                <div>
                                    <p className='text-white font-medium'>
                                        {useRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}
                                    </p>
                                    {useRole === "DOCTOR" && (
                                        <p className='text-muted-foreground text-sm'>
                                            {otherParty.email}
                                        </p>
                                    )}
                                    {useRole === "PATIENT" && (
                                        <p className='text-muted-foreground text-sm'>
                                            {otherParty.specialty}
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <h4 className='text-sm font-medium text-muted-foreground'>Scheduled Time</h4>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center'>
                                    <Calendar className='h-4 w-4 text-emerald-400 mr-2' />
                                    <p className='text-white'>
                                        {formatDateTime(appointment.startTime)}
                                    </p>
                                </div>
                                <div className='flex items-center'>
                                    <Clock className='h-5 w-5 text-emerald-400 mr-2' />
                                    <p className='text-white'>
                                        {formatTime(appointment.startTime)}-
                                        {formatTime(appointment.endTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <h4 className='text-sm font-medium text-muted-foreground'>
                                Status
                            </h4>
                            <Badge
                                variant={"outline"}
                                className={
                                    appointment.status === "COMPLETED"
                                        ? "bg-emerald-900/90 border-emerald-800/60 text-emerald-400"
                                        : appointment.status === "CANCELLED"
                                            ? "bg-red-900/90 border-red-800/60 text-red-400"
                                            : "bg-amber-900/90 border-amber-800/60 text-amber-400"
                                }
                            >{appointment.status}</Badge>
                        </div>
                        {appointment.diseases && (
                            <div className='flex flex-row gap-2'>
                                <h4 className='text-sm font-medium text-muted-foreground'>
                                    Diseases:
                                </h4>
                                <div className='rounded-md'>
                                    <p className='text-emerald-500'>
                                        {appointment.diseases}
                                    </p>
                                </div>
                            </div>
                        )}
                        {appointment.patientDescription && (
                            <div className='space-y-2'>
                                <h4 className='text-sm font-medium text-muted-foreground'>
                                    {useRole === "DOCTOR" ? "Patient Description" : "Your Description"}
                                </h4>
                                <div className='p-3 rounded-md bg-muted/20 border border-emerald-700'>
                                    <p className='text-white whitespace-pre-line'>
                                        {appointment.patientDescription}
                                    </p>
                                </div>
                            </div>
                        )}


                        {appointment.status === "SCHEDULED" && (
                            <div className='space-y-2'>
                                <h4 className='text-sm font-medium text-muted-foreground'>Video Consultation</h4>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={!isAppointmentActive() || action === "video" || tokenLoading} onClick={handleJoinVideoCall}>
                                    {
                                        tokenLoading || action === "video" ? (
                                            <>
                                                <Loader className='mr-2 h-4 w-4 text-emerald-400' />
                                                Preparing Video Call...
                                            </>
                                        ) : (
                                            <>
                                                <Video className='mr-2 h-4 w-4 ' />
                                                {isAppointmentActive() ? "Join Video Call" : "Video Call Not Available"}
                                            </>
                                        )
                                    }
                                </Button>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <h4 className='text-sm font-medium text-muted-foreground'>Doctor Notes</h4>
                                {useRole  === "DOCTOR" && action!=="notes" && appointment.status !== "CANCELLED " && (
                                    <Button
                                    className=" h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                                    onClick = {()=>setAction("notes")}
                                    size="sm"
                                    variant="ghost"
                                    >
                                        <Edit className='h-4 w-4 mr-2'/>
                                        {appointment.notes ? "Edit Notes" : "Add Notes"}
                                    </Button>
                                )}
                            </div>
                            {useRole === "DOCTOR" && action === "notes" ? (
                                <div className='space-y-3'>
                                    <Textarea value={notes} className="bg-background border border-emerald-700 min-h-[100px]" onChange={(e)=>setNotes(e.target.value)} placeholder="Enter your clinical notes here"/>
                                    <div className='flex justify-end space-x-2'>
                                        <Button type="button" variant="outline" size="sm" onClick={()=>{
                                            setAction(null) 
                                            setNotes(appointment.notes || "")
                                        }} disabled={notesLoading} className="border-emerald-700">
                                            Cancel
                                        </Button>

                                        <Button size="sm" onClick={handleSaveNotes} className="bg-emerald-600 hover:bg-emerald-700" disabled={notesLoading}>
                                            {notesLoading ? (
                                                <>
                                                    <Loader className='mr-2 h-4 w-4 text-emerald-400' />
                                                    Saving...
                                                </>
                                            ):(
                                                "Save Notes"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ):(
                                <div className='p-3 rounded-md bg-muted/20 border border-emerald-700 min-h-[80px]'>
                                    {appointment.notes ? (
                                        <p className='text-white whitespace-pre-line'>
                                            {appointment.notes}
                                        </p>
                                    ):(
                                        <p className='text-muted-foreground italic'>
                                            No notes added yet
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                    {appointment.status === "SCHEDULED" && (
                        <Button onClick={handleCancelAppointment} disabled={cancelLoading} className="border-red-700/60 text-red-500 hover:bg-red-900/20 mt-3 sm:mt-0">
                            {
                                cancelLoading ? (
                                    <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Cancelling...
                                    
                                    </>
                                ) : (
                                    <>
                                    <X className='mr-2 h-4 w-4' />
                                    Cancel Appointment
                                    </>
                                    
                                )
                            }
                        </Button>
                    )}
                </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default AppointmentCard