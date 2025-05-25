"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/supabase";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("courses").insert([formData]).select();
    if (error) return console.error("Error:", error);
    setCourses((prev) => [...prev, ...data]);
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Courses</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Course Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g. 6 weeks)"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price (in Rs)"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Courses</p>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Popular Course</p>
            <p className="text-2xl font-bold">Frontend Bootcamp</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Recently Added Courses */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recently Added Courses</h3>
        <div className="border rounded-lg p-4 space-y-2">
          {courses.length > 0 ? (
            courses.slice(-5).map((course, i) => (
              <div key={i}>
                <p className="font-medium">{course.name}</p>
                <p className="text-sm text-muted-foreground">
                  {course.duration} — Rs. {course.price}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
