// pages/StudentsPage.tsx (Main Component)
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentForm from "@/components/student-form";
import { PaymentStatsCards } from "@/components/students/PaymentStatsCards";
import { StudentsFilters } from "@/components/students/StudentsFilters";
import { StudentsList } from "@/components/students/StudentsList";
import { useStudentsData } from "@/hooks/useStudentsData";

type PaymentStatus = "Paid" | "Due" | "Partial";

export default function StudentsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">(
    "all"
  );

  const {
    paymentStats,
    loading,
    fetchStudents,
    deleteStudent,
    getFilteredStudents,
  } = useStudentsData();

  const filteredStudents = getFilteredStudents(searchTerm, paymentFilter);

  const handleStudentSubmit = async () => {
    await fetchStudents();
    setOpen(false);
  };

  if (loading) {
    return <div className="p-4">Loading students...</div>;
  }

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
            <StudentForm onSubmit={handleStudentSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard Cards */}
      <PaymentStatsCards stats={paymentStats} />

      <Separator />

      {/* Filters */}
      <StudentsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
      />

      {/* Students List */}
      <StudentsList students={filteredStudents} onDelete={deleteStudent} />
    </div>
  );
}
