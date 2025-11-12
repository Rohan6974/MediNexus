"use client"

import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { z } from 'zod'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { addMedicine } from '@/actions/medicine';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

const MedicineAdd = ({ doctor }) => {

  const MedicineFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.preprocess((val) => Number(val), z.number().min(1, "Price is required")),
    imageUrl: z.string().url("Please enter a valid url"),
    dosage: z.string().min(1, "Dosage is required"),
    description: z.string().min(1, "Description is required"),
    specialty: z.string().min(1, "Specialty is required"),
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(MedicineFormSchema),
    defaultValues: {
      name: "",
      price: "",
      imageUrl: "",
      dosage: "",
      description: "",
      specialty: "",
    },
  })

  const { loading, data, fn: submitMedicine } = useFetch(addMedicine);

  const onMedicineSubmit = async (data) => {
    console.log("Submitting form data:", data);
    if (loading) {
      console.log("Already loading...");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("imageUrl", data.imageUrl);
      formData.append("dosage", data.dosage);
      formData.append("description", data.description);
      formData.append("specialty", data.specialty);

      console.log("Calling submitMedicine...");
      await submitMedicine(formData);
      console.log("Submission complete");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    if (data) {
      toast.success("Medicine added successfully");
      redirect("/medicine")
    }
  }, [data]);

  return (

    <Card className="border-emerald-600/90 max-w-full ">
      <CardHeader>
        <CardTitle className={"text-emerald-500 text-2xl md:text-3xl font-bold"}>Add Medicine</CardTitle>
        <CardDescription className={"text-muted-foreground"}>
          Add Medicine only according to your specialty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onMedicineSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input {...register("name")} id="name" placeholder="Name of Medicine" />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price</Label>
              <Input {...register("price")} id="price" placeholder="Price In Credits" />
              {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input {...register("imageUrl")} id="imageUrl" placeholder="Image URL" />
              {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input {...register("dosage")} id="dosage" placeholder="Dosage" />
              {errors.dosage && <p className="text-red-500 text-xs">{errors.dosage.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea {...register("description")} id="description" placeholder="Description" />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Input readOnly {...register("specialty")} id="specialty" placeholder="Specialty" value={doctor?.specialty} />
              {errors.specialty && <p className="text-red-500 text-xs">{errors.specialty.message}</p>}
            </div>
          </div>

          <CardFooter className="flex-col pt-8 gap-2">
            <Button type="submit" className="w-full bg-emerald-400 hover:bg-emerald-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Medicine"
              )}
            </Button>

          </CardFooter>

        </form>
      </CardContent>
    </Card>

  )
}

export default MedicineAdd