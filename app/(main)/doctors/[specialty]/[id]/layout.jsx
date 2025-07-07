import { getDoctorById } from "@/actions/appointments";
import PageHeader from "@/components/page-header";
import { redirect } from "next/navigation";


export async function generateMetadata({ params }) {
    const { id } = await params;

    const { doctor } = await getDoctorById(id);
    return {
        title: `Dr. ${doctor.name} - MediMeet`,
        description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
    };
}

export default async function DoctorProfileLayout({ children, params }) {
    const { id } = await params;
    const { doctor } = await getDoctorById(id);

    if (!doctor) redirect("/doctors");

    return (
        <div className="container mx-auto">
            <PageHeader
                title={"Dr. " + doctor.name}
                backlink={`/doctors/${doctor.specialty}`}
                backlabel={`Back to ${doctor.specialty}`}
            />

            {children}
        </div>
    );
}