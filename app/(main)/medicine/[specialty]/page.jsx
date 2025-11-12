import { getMedicineBySpecialty } from '@/actions/medicine'
import MedicineCard from '@/components/medicine-card'
import PageHeader from '@/components/page-header'
import React from 'react'

const SpecialtiesPage = async ({ params }) => {
  const { specialty } = await params

  if (!specialty) {
    redirect('/')
  }

  const { medicines, error } = await getMedicineBySpecialty(specialty)

  if (error) {
    console.log(error)
  }
  return (
    <div className='space-y-5'>
      <PageHeader title={specialty.split('%20').join(' ')} backlabel='All Specialties' backlink='/medicine' />

      {medicines && medicines.length ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {medicines.map((medicines) => (
            <MedicineCard key={medicines.id} medicines={medicines} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <h3 className='text-lg font-medium text-emerald-500 mb-2'>
            No Medicines Available
          </h3>
          <p className='text-muted-foreground'>
            There are currently no medicine in this specialty. Please check back later or choose another specialty
          </p>
        </div>
      )}
    </div>
  )
}

export default SpecialtiesPage