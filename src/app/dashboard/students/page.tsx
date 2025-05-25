"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/supabase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    course: "",
    start_date: "",
    end_date: "",
    shift: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("students")
      .insert([formData])
      .select();
    if (error) return console.error("Error:", error);
    setStudents((prev) => [...prev, ...data]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      course: "",
      start_date: "",
      end_date: "",
      shift: "",
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Students</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Shift</option>
                <option value="8:30 to 10:00">8:30 to 10:00</option>
                <option value="11:00 to 12:30">11:00 to 12:30</option>
                <option value="12:30 to 2">12:30 to 2</option>
              </select>

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
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Courses</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Recently Added */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recently Added Students</h3>
        <div className="border rounded-lg p-4 space-y-2">
          {students.length > 0 ? (
            students.slice(-5).map((student, i) => (
              <div key={i}>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.email} — {student.shift}
                </p>
                <p className="text-sm text-muted-foreground">
                  {student.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {student.address}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent students yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
