"use client";

import { updateDoctorActiveStatus } from '@/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/use-fetch';
import { BanIcon, Loader2, Search, User2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const VerifiedDoctors = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetDoctor, setTargetDoctor] = useState(null);
  const filterDoctor = doctors.filter((doctor) => {
    const query = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    )
  })

  const handleStatusChange = async (doctor) => {

    const confirmed = window.confirm(`Are you sre you want to suspend ${doctor.name}`)
    if (loading) return
    if (!confirmed || loading) return

    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", "true");

    setTargetDoctor(doctor)
    await submitStatusUpdate(formData);
  };

  const { loading, data, fn: submitStatusUpdate } = useFetch(updateDoctorActiveStatus);


  useEffect(() => {
    if (data?.success && targetDoctor) {
      toast.success(`Successfully suspended ${targetDoctor.name}`);
      setTargetDoctor(null);
    }
  }, [data]);
  return (
    <div>
      <Card className="bg-muted/20 border-emerald-800/80">
        <CardHeader>

          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle className="text-lg font-bold text-emerald-400">Manage Doctors</CardTitle>
              <CardDescription className="text-muted-foreground">View and manage all verified Doctors</CardDescription>
            </div>
            <div className='relative w-full md:w-64'>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 bg-background border-emerald-700/80" placeholder="Search Doctors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filterDoctor.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              {searchTerm ? "No doctors found for your search term." : "No verified doctors available."}
            </div>
          ) : (
            <div className=''>
              {filterDoctor.map((doctor) => (
                <Card
                  className="bg-background border-emerald-800/90 hover:border-emerald-500/70 transition-all"
                  key={doctor.id}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted/20 rounded-full p-2 w-9">
                          <User2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-emerald-700/90">
                            Name: {doctor.name}
                          </h3>
                          <p className="text-sm">
                            Specialty: {doctor.specialty} , {doctor.experience}{" "}
                            years of experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <Badge
                          variant={"outline"}
                          className="bg-emerald-900/20 h-9 w-16 text-xs border-emerald-700/90 text-emerald-400"
                        >
                          Active
                        </Badge>
                        <Button
                          variant={"outline"}
                          onClick={() => handleStatusChange(doctor)}
                          className="text-red-400 border-red-900/30 hover:border-red-900/10 cursor-pointer"
                        >
                          {loading && targetDoctor?.id === doctor.id ? <Loader2 className='h-4 w-4mr-1 animate-spin' /> : <BanIcon className='h-4 w-4 mr-1' />}
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

      </Card>
    </div>
  )
}

export default VerifiedDoctors