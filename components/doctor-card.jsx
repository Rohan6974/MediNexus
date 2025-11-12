import React from 'react'
import { Card, CardContent } from './ui/card'
import { Calendar, StarIcon, User } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Link from 'next/link'

const DoctorCard = ({ doctor }) => {
    return (
        <Card className="border-emerald-600/90 hover:border-emerald-800/40 transition-all">
            <CardContent className="pt-4">
                <div className='flex gap-4 items-start'>
                    <div className='w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center flex-shrink-0'>
                        {
                            doctor.imageUrl ? (
                                <img src={doctor.imageUrl} alt={doctor.name} className='w-8 h-8 rounded-full object-cover' />
                            ) : (
                                <User className='w-8 h-8 text-emerald-400' />
                            )
                        }
                    </div>

                    <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
                            <h3 className='font-medium text-white text-lg'>{doctor.name}</h3>
                            <Badge variant={"outline"} className="bg-emerald-800/60 border-emerald-600/30 text-emerald-400 self-start" >
                                <StarIcon className='h-3 w-3 mr-1' />
                                Verified
                            </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground mb-1'>
                            {doctor.specialty} - {doctor.experience} years of experience
                        </p>
                        <div className='mt-4 line-clamp-2 text-sm text-muted-foreground mb-4'>
                            {doctor.description}
                        </div>
                        <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all mt-2">
                            <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}><Calendar className='h-4 w-4 mr-2' />View Profile and Book</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DoctorCard