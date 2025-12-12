"use client"

import { Button } from '@/components/ui/button'
import { Loader2, Mic, MicOff, Phone, PhoneOff, User, Video, VideoOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const VideoCall = ({ sessionId, token }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [isConnedted, setIsConnedted] = useState(false)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)

    const sessionRef = useRef(null)
    const publisherRef = useRef(null)

    const router = useRouter()

    const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID

    const handleScriptLoad = () => {
        setScriptLoaded(true)

        if (!window.OT) {
            toast.error("Failed to load script")
            setIsLoading(false)
            return
        }

        initializeSession()
    }

    const initializeSession = () => {
        if (!sessionId || !token || !appId) {
            toast.error("Invalid session details")
            router.push("/appointments")
            return
        }

        try {
            sessionRef.current = window.OT.initSession(appId, sessionId)

            sessionRef.current.on("streamCreated", (event) => {
                sessionRef.current.subscribe(event.stream, "subscriber", {
                    insertMode: "append",
                    width: "100%",
                    height: "100%"
                },
                (error) => {
                        if (error) {
                            toast.error("Error connecting to other participants stream")
                        }
                    }
                )
            })

            sessionRef.current.on("sessionConnected", () => {
                setIsConnedted(true)
                setIsLoading(false)

                publisherRef.current = window.OT.initPublisher("publisher", {
                    insertMode:"replace",
                    width: "100%",
                    height: "100%",
                    publishAudio: true,
                    publishVideo: true
                },
                (error) => {
                    if(error){
                        console.log(error)
                        toast.error("Error initializing your microphone and camera")
                    }else{
                        console.log("Publisher initialized successfully")
                    }
                })
            })

            sessionRef.current.on("sessionDisconnected", () => {
                setIsConnedted(false)
            })

            sessionRef.current.connect(token, (error) => {
                if(error){
                    toast.error("Error connecting to the session")
                }else{
                    if(publisherRef.current){
                        sessionRef.current.publish(publisherRef.current, (error)=>{
                            if(error){
                                console.log(error)
                                toast.error("Error publishing your stream")
                            }else{
                                console.log("Stream published successfully")
                            }
                        })
                    }
                }
            })

        } catch (error) {
            toast.error("Error initializing the session")
            setIsLoading(false)

        }
    }

    const toggleVideo = () =>{
        if(publisherRef.current){
            publisherRef.current.publishVideo(!isVideoEnabled)
            setIsVideoEnabled((prev) => !prev)
        }
    }
    const toggleAudio = () =>{
        if(publisherRef.current){
            publisherRef.current.publishAudio(!isAudioEnabled)
            setIsAudioEnabled((prev) => !prev)
        }
    }

    const endCall = () =>{
        if(sessionRef.current){
            publisherRef.current.destroy()
            publisherRef.current = null
        }

        if(sessionRef.current){
            sessionRef.current.disconnect()
            sessionRef.current = null
        } 

        router.push("/appointments")
    }

    useEffect(() => {
      return () => {
        if(publisherRef.current){
            publisherRef.current.destroy()
        }
        if(sessionRef.current){
            sessionRef.current.disconnect()
        }
      }
    }, [])
    

    if (!sessionId || !token || !appId) {
        return (
            <div className='container mx-auto px-4 py-12 text-center'>
                <h1 className='text-3xl font-bold text-white mb-4'>
                    Invalid Video Call
                </h1>
                <p className='text-muted-foreground mb-6'>
                    Missing Required Parametersfor the video call
                </p>
                <Button onClick={() => router.push("/appointments")} className="bg-emerald-600 hover:bg-emerald-700">
                    Back to Appointments
                </Button>
            </div>
        )
    }

    return (
       <>
            <Script
                src='https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js'
                onLoad={handleScriptLoad}
                onError={() => {
                    toast.error("Failed to load script")
                    setIsLoading(false)
                }}
            />

            <div className='container mx-auto px-4 py-8'>
                <div className='text-center mb-6'>
                    <h1 className='text-3xl font-bold text-white mb-2'>
                        Video Consultation
                    </h1>
                    <p className='text-muted-foreground'>
                        {isConnedted ? "Connected" : isLoading ? "Connecting..." : "Connection Failed   "}
                    </p>
                </div>

                {isLoading && !scriptLoaded ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <Loader2 className='animate-spin mb-4 text-emerald-400 h-12 w-12'/>
                        <p className='text-white text-lg'>
                            Loading video call componentes...
                        </p>
                    </div>
                ):(
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <div className='border border-emerald-700 rounded-lg overflow-hidden'>
                                <div className='bg-emerald-900/30 text-emerald-400 text-sm font-medium'>
                                    You
                                </div>
                                <div className='w-full h-[300px] md:h-[400px] bg-muted/30' id='publisher'> 
                                    {!scriptLoaded && (
                                        <div className='flex items-center justify-center h-full'>
                                            <div className='bg-muted/20 rounded-full p-8'>
                                                <User className='h-12 w-12 text-emerald-400'/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className='border border-emerald-700 rounded-lg overflow-hidden'>
                                <div className='bg-emerald-900/30 text-emerald-400 text-sm font-medium'>
                                    Other Participant
                                </div>
                                <div className='w-full h-[300px] md:h-[400px] bg-muted/30' id='subscriber'>
                                {(!scriptLoaded || !isConnedted) && (
                                    <div className='flex items-center justify-center h-full'>
                                        <div className='bg-muted/20 rounded-full p-8'>
                                            <User className='h-12 w-12 text-emerald-400'/>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center space-x-4'>
                            <Button
                            size="lg"
                            onClick={toggleVideo}
                            className={`rounded-full p-4 h-14 w-14 ${
                                isVideoEnabled
                                ? "border-emerald-700 bg-emerald-900 text-emerald-400 hover:bg-emerald-800"
                                : "bg-red-900/20 border-red-900/80 text-red-400 hover:bg-red-900"
                            }`}
                            disabled={!publisherRef.current}
                            >
                                {isVideoEnabled ? <Video/> : <VideoOff/>}
                            </Button>
                            <Button
                            size="lg"
                            onClick={toggleAudio}
                            className={`rounded-full p-4 h-14 w-14 ${
                                isAudioEnabled
                                ? "border-emerald-700 bg-emerald-900 text-emerald-400 hover:bg-emerald-800"
                                : "bg-red-900/20 border-red-900/80 text-red-400 hover:bg-red-900"
                            }`}
                            disabled={!publisherRef.current}
                            >
                                {isAudioEnabled ? <Mic/> : <MicOff/>}
                            </Button>

                            <Button 
                            variant="destructive"
                            size="lg"
                            onClick={endCall}
                            className=" rounded-full p-4 h-14 w-14 bg-red-900/20 border-red-900/80 text-red-400 hover:bg-red-900"
                            >
                                <PhoneOff className="h-6 w-6"/>
                            </Button>
                        </div>
                        <div className='text-center'>
                            <p className='text-muted-foreground text-sm'>
                                {isVideoEnabled ? "Video" : "Video Off"}{" "}
                                {isAudioEnabled ? "Audio" : "Audio Off"}
                            </p>
                            <p className='text-muted-foreground text-sm mt-1'>
                                When you are finished with your consultation, click the end call button
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default VideoCall