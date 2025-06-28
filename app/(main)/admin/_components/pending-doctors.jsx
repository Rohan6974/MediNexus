"use client";

import { updateDoctorStatus } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { CheckCheck, CheckCircle, ExternalLink, FileText, Medal, StethoscopeIcon, User, User2, User2Icon, X, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const PendingDoctors = ({ doctors }) => {
  const [selectedDoctors, setSelectedDoctors] = useState(null);

  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorStatus);

  const handleViewDetails = (doctor) => {
    setSelectedDoctors(doctor);
  };

  const handleUpdateStatus = async (doctorId, status) => {
    if (loading) return

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", status);

    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data?.success) {
      handleCloseDialog();
    }
  }, [data]);
  const handleCloseDialog = () => {
    setSelectedDoctors(null);
  };
  return (
    <div>
      <Card className="bg-muted/50 border-emerald-900/90">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-emerald-700">
            Pending Doctors Verification
          </CardTitle>
          <CardDescription>
            Review and approve doctors application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending verification request at this time
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card
                className="bg-background border-emerald-800/90 hover:border-emerald-500/70 transition-all"
                key={doctor.id}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <img src={doctor.imageUrl} alt={doctor.name} className="h-8 w-8 rounded-full" />
                      </div>
                      <div>
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
                          className="bg-amber-900/20 h-9 w-16 text-xs border-amber-700/90 text-amber-300"
                          >
                          Pending
                        </Badge>
                        <Button
                          variant={"outline"}
                          onClick={() => handleViewDetails(doctor)}
                          className="bg-emerald-400 border-emerald-800/90 hover:border-emerald-400/70 cursor-pointer"
                          >
                          View Details
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

              
      {selectedDoctors && (
        <Dialog open={!!selectedDoctors} onOpenChange={handleCloseDialog}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className={"max-w-3xl"}>
            <DialogHeader>
              <DialogTitle className={"text-xl font-bold text-emerald-600"}>
                Doctor Verification Details
              </DialogTitle>
              <DialogDescription>
                Review the doctor&apos;s information carefully before making a
                decision.
              </DialogDescription>
            </DialogHeader>
            <Separator className={"bg-emerald-500/80"} />

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h2 className="text-md font-bold">
                Personal information
              </h2>
            </div>
            <div className="space-y-2 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium text-emerald-500">
                    Image:
                  </h4>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={selectedDoctors.imageUrl}
                    alt={selectedDoctors.name}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium text-emerald-500">
                    Name:
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedDoctors.name}
                  </p>
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium text-emerald-500">
                    Mail:
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedDoctors.email}
                  </p>
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium text-emerald-500">
                    Application Date:
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    {format(new Date(selectedDoctors.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              <Separator className={"bg-emerald-500/80"} />


              <div className="flex items-center ">
                <Medal className="h-4 w-4" />
                <h2 className="text-md font-bold">
                  Medical information
                </h2>
              </div>


              <div>
                <div className="grid grid-cols-1 py-4md:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="space-y-1 mt-">
                    <h4 className="text-md font-bold text-emerald-500">
                      Specialty:
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground">{selectedDoctors.specialty}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-md font-bold text-emerald-500">
                      Years of Experience:
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground">{selectedDoctors.experience}</p>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <h4 className="text-md font-bold text-emerald-500">
                      Credentials :
                    </h4>
                    <div className="flex items-center">
                      <a
                        href={selectedDoctors.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-800 flex items-center"
                      >
                        View Credentials
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className={"bg-emerald-500/80 w-full"} />

              <div className="space-y-2">
                <div className="flex items-center gap-2 py-4">
                  <FileText className="h-4 w-4" />
                  <h3 className="text-md font-bold">Service Description</h3>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{selectedDoctors.description}</p>
              </div>

            </div>

            {loading && <BarLoader color={"#36d7b7"} height={3} width={"100%"} />}

            <DialogFooter className="flex sm:justify-between">
              <Button disabled={loading} onClick={() => handleUpdateStatus(selectedDoctors.id, "REJECTED")} className='bg-red-500 hover:bg-red-500/80'><XCircle className="h-4 w-4 mr-2" />Reject</Button>
              <Button disabled={loading} onClick={() => handleUpdateStatus(selectedDoctors.id, "VERIFIED")} className='bg-emerald-400 hover:bg-emerald-500/80'><CheckCircle className="h-4 w-4 mr-2" />Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PendingDoctors;
