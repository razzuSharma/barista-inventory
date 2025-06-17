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
  DialogFooter,
} from "@/components/ui/dialog";
import StudentForm from "@/components/student-form";
import { CardListItem } from "@/components/CardListItem";
import { IconSearch } from "@tabler/icons-react";
import EditStudentsDialog from "./EditStudentsDialog";
import ViewStudentDialog from "./ViewStudentDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        enrollments (
          course: courses (
            id,
            name,
            duration
          )
        )
      `
      )
      .eq("deleted", false);

    if (error) {
      console.error("Fetch error", error); // Log the error for debugging
      return; // Exit if there's an error
    }

    const transformed = data?.map((student) => ({
      ...student,
      courses:
        student.enrollments
          ?.map((enrollment: any) => enrollment.course)
          .filter(Boolean) || [], // Ensure courses is an empty array if undefined
    }));

    console.log("Fetched students:", transformed); // Log the transformed data for debugging
    setStudents(transformed || []);
  };

  const handleConfirmDelete = async (student: any) => {
    if (!student) return;
    const { error } = await supabase
      .from("students")
      .update({ deleted: true }) // soft delete
      .eq("id", student.id);
    if (error) return console.error("Delete error", error);

    setDeleteDialogOpen(false);
    fetchStudents();
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
        <div className="relative w-full max-w-md mx-auto mb-4">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md"
          />
        </div>

        <h3 className="text-xl font-semibold">Recently Added Students</h3>
        <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
          {filteredStudents.length > 0 ? (
            filteredStudents
              .slice(-5)
              .reverse()
              .map((student) => {
                const avatarUrl = (() => {
                  if (!student.gender) return "/avatars/neutral-avatar.jpg";
                  const genderLower = student.gender.toLowerCase();
                  if (genderLower === "male") return "/avatars/male-avatar.jpg";
                  if (genderLower === "female")
                    return "/avatars/female-avatar.jpg";
                  return "/avatars/neutral-avatar.jpg";
                })();

                return (
                  <CardListItem
                    key={student.id}
                    avatarUrl={avatarUrl}
                    title={student.name}
                    subtitle={`${student.email} — ${student.shift}`}
                    extraInfo={`Gender: ${student.gender || "Not specified"}`}
                  >
                    <div className="flex gap-2">
                      <ViewStudentDialog student={student} />
                      <EditStudentsDialog
                        student={student}
                        onUpdated={fetchStudents}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{student.name}</strong>? This action cannot
                            be undone.
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleConfirmDelete(student)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardListItem>
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
