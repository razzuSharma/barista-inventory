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
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recently Added Students</h3>
        <div className="border rounded-lg p-4 space-y-2">
          {students.length > 0 ? (
            students
              .slice(-5)
              .reverse()
              .map((student, i) => {
                const isMale = student.gender?.toLowerCase() === "male";
                // Default avatars (you can replace URLs with your own images)
                const avatarUrl = isMale
                  ? "/avatars/male-avatar.png"
                  : "/avatars/female-avatar.png";

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    {/* Avatar */}
                    <img
                      src={avatarUrl}
                      alt={`${student.name} avatar`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />

                    {/* Student info */}
                    <div className="flex-grow">
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
                      <p className="text-sm text-muted-foreground font-semibold mt-1">
                        Gender: {student.gender || "Not specified"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-muted-foreground">No recent students yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
