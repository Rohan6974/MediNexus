"use client"

import { addMedicine } from '@/actions/medicine'
import { Card, CardContent } from '@/components/ui/card'
import { SPECIALTIES } from '@/lib/specialties'
import Link from 'next/link'
import React from 'react'

const MedicinePage = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center mb-8 text-center'>
        <h1 className='text-3xl mb-2 md:text-4xl bg-gradient-to-b from-emerald-500 to-teal-400 font-bold text-transparent bg-clip-text'>
          Find Your Medicines
        </h1>
        <p className='text-muted-foreground text-lg'>
          Browse through our list of <span className='bg-gradient-to-b from-emerald-500 to-teal-400 text-transparent bg-clip-text'>specialties</span> to find the right <span className='bg-gradient-to-b from-emerald-500 to-teal-400 text-transparent bg-clip-text'>medicines</span> for your needs.
        </p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {SPECIALTIES.map((spec) => (
          <Link key={spec.name} href={`/medicine/${spec.name}`}>
            <Card className="border-emerald-600/90 hover:border-emerald-800/40 transition-all h-full cursor-pointer">
              <CardContent className="flex flex-col p-6 items-center justify-center text-center h-full">
                <div className='h-12 w-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4'>
                  <div className='text-emerald-400'>{spec.icon}</div>
                </div>
                <h3 className='font-medium text-white'>{spec.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}

export default MedicinePage