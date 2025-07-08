"use client";

import React, { useEffect, useState } from "react";
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
import { CardListItem } from "@/components/CardListItem";
import { EditCourseDialog } from "./EditCourseDialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export type Course = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
};

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- added state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent multiple submits
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([formData])
        .select();

      if (error) return console.error("Error:", error);

      setCourses((prev) => [...prev, ...data]);

      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {

    const { error } = await supabase
      .from("courses")
      .update({ is_deleted: true })
      .eq("id", courseId);

    if (error) return console.error("Delete Error:", error);
    fetchCourses();
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_deleted", false); // only fetch visible records

    if (error) return console.error("Error:", error);
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
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
            <p className="text-2xl font-bold">Coffee Barista</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Recently Added Courses */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recently Added Courses</h3>
        <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
          {courses.length > 0 ? (
            courses.slice(0, 5).map((course) => (
              <CardListItem
                key={course.id}
                title={course.name}
                subtitle={`Duration: ${course.duration} — Rs. ${course.price}`}
              >
                <EditCourseDialog course={course} onUpdated={fetchCourses} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(course.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardListItem>
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
