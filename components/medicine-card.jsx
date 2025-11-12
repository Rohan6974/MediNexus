import Image from 'next/image'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'

const MedicineCard = ({ medicines }) => {
    return (
        <Card className="border-emerald-600/90 hover:border-emerald-800/40 transition-all">
            <CardContent>
                <div className='grid grid-rows-2 gap-4'>
                   <div>
                    <img src={medicines.imageUrl} alt={medicines.name} className='w-full h-40 object-fill' />
                   </div>

                   <div>
                    <h3 className='font-medium text-white'>Name:<span className='text-emerald-400'>{medicines.name}</span></h3>
                    <Button variant="link" className="text-muted-foreground">
                        <Link href={`/medicine/${medicines.specialty}/${medicines.id}`}>View Details</Link>
                    </Button>
                   </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MedicineCard