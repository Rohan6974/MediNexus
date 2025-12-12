"use client";

import { getPatientSeverity, updatePatientSeverity } from "@/actions/patient";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Loader2, ShieldAlertIcon, User } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
    const [severity, setSeverity] = useState(null);
    const { loading, fn: updateSeverityFn, data } = useFetch(updatePatientSeverity);

    useEffect(() => {
        const fetchSeverity = async () => {
            try {
                const result = await getPatientSeverity();
                setSeverity(result.severity);
            } catch (error) {
                console.error("Failed to fetch severity:", error);
            }
        };
        fetchSeverity();
    }, []);

    const handleSeveritySelection = async (newSeverity) => {
        if (loading) return;
        await updateSeverityFn(newSeverity);
        setSeverity(newSeverity); // Optimistic update
    };

    useEffect(() => {
        if (data && data.success) {
            toast.success("Severity updated successfully");
            redirect("/")
        } else if (data && data.error) {
            toast.error(data.error);
        }
    }, [data]);

    if (severity === null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Patient Settings</h1>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-emerald-400 mb-4">Disease Severity</h2>
                    <p className="text-muted-foreground mb-6">
                        Update your condition severity to adjust your appointment options.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <Card
                        onClick={() => !loading && handleSeveritySelection("MILD")}
                        className={`border-emerald-700/20 hover:border-emerald-700/90 cursor-pointer transition-all ${severity === "MILD" ? "border-emerald-500 bg-emerald-900/20" : ""
                            }`}
                    >
                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                            <div className="p-4 bg-emerald-800/90 rounded-full mb-6">
                                <User className="h-8 w-8 text-emerald-400" />
                            </div>
                            <CardTitle className="text-xl font-bold text-fuchsia-100 mb-2 ">
                                Mild Condition
                            </CardTitle>
                            <CardDescription className="mb-5 text-muted-foreground">
                                Standard access to video consultations and online appointments.
                            </CardDescription>
                            <Button
                                disabled={loading}
                                variant={severity === "MILD" ? "default" : "outline"}
                                className={`w-full mt-4 ${severity === "MILD" ? "bg-emerald-600 hover:bg-emerald-800/80" : ""}`}
                            >
                                {loading && severity !== "MILD" ? ( // Show loading only if changing TO this
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    severity === "MILD" ? "Selected" : "Select Mild"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => !loading && handleSeveritySelection("SEVERE")}
                        className={`border-emerald-700/20 hover:border-emerald-700/90 cursor-pointer transition-all ${severity === "SEVERE" ? "border-red-500 bg-red-900/20" : ""
                            }`}
                    >
                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                            <div className="p-4 bg-red-800/90 rounded-full mb-6">
                                <ShieldAlertIcon className="h-8 w-8 text-red-400" />
                            </div>
                            <CardTitle className="text-xl font-bold text-fuchsia-100 mb-2 ">
                                Severe Condition
                            </CardTitle>
                            <CardDescription className="mb-5 text-muted-foreground">
                                Requires physical visits. Video consultations will not be available.
                            </CardDescription>
                            <Button
                                disabled={loading}
                                variant={severity === "SEVERE" ? "destructive" : "outline"}
                                className={`w-full mt-4 ${severity === "SEVERE" ? "bg-red-600 hover:bg-red-800/80" : ""}`}
                            >
                                {loading && severity !== "SEVERE" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    severity === "SEVERE" ? "Selected" : "Select Severe"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
