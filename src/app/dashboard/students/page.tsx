"use client";
import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import StudentForm from "@/components/student-form";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) console.error("Error fetching students:", error);
    else setStudents(data);
  };

  const handleEdit = (student: any) => {
    console.log(student);
  };

  const handleDelete = (studentId: string) => {
    console.log(studentId);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Students</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm onSubmit={fetchStudents} />
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
            <p className="text-2xl font-bold">5</p>{" "}
            {/* You can make this dynamic */}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Courses</p>
            <p className="text-2xl font-bold">12</p>{" "}
            {/* You can make this dynamic */}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Recently Added */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recently Added Students</h3>
        <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
          {students.length > 0 ? (
            students
              .slice(-5)
              .reverse()
              .map((student, i) => {
                const avatarUrl = (() => {
                  if (!student.gender) return "/avatars/neutral-avatar.jpg"; // no gender specified
                  const genderLower = student.gender.toLowerCase();
                  if (genderLower === "male") return "/avatars/male-avatar.jpg";
                  if (genderLower === "female")
                    return "/avatars/female-avatar.jpg";
                  return "/avatars/neutral-avatar.jpg"; // for other genders
                })();

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Avatar */}
                    <img
                      src={avatarUrl}
                      alt={`${student.name} avatar`}
                      className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover mr-6"
                    />

                    {/* Student info */}
                    <div className="flex-grow">
                      <p className="font-semibold text-lg text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.email} &mdash;{" "}
                        <span className="italic">{student.shift}</span>
                      </p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                      <p className="text-sm text-gray-600">{student.address}</p>
                      <p className="text-sm font-semibold mt-1 text-indigo-600">
                        Gender: {student.gender || "Not specified"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 italic">No recent students yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
