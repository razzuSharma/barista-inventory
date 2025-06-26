import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { Student } from "@/lib/supabase/studentHelpers";
import { getStudentsQuery } from "@/lib/queries/students";

type PaymentStatus = "Paid" | "Due" | "Partial";

export const useStudentsData = () => {
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: getStudentsQuery,
  });

  const studentsWithStatus = useMemo(() => {
    return students.map((student) => {
      const totalFees = student.totalFees || 0;
      const totalPaid = student.totalPaid || 0;
      const dueAmount = Math.max(totalFees - totalPaid, 0);
      const status = student.paymentStatus || "Due";

      return {
        ...student,
        dueAmount,
        paymentStatus: status,
      };
    });
  }, [students]);

  const paymentStats = useMemo(() => {
    const enrolledStudents = studentsWithStatus.filter(
      (student) => student.enrollments && student.enrollments.length > 0
    );

    return {
      total: enrolledStudents.length,
      paid: enrolledStudents.filter((s) => s.paymentStatus === "Paid").length,
      partial: enrolledStudents.filter((s) => s.paymentStatus === "Partial")
        .length,
      due: enrolledStudents.filter((s) => s.paymentStatus === "Due").length,
      totalDueAmount: enrolledStudents.reduce((sum, s) => sum + s.dueAmount, 0),
    };
  }, [studentsWithStatus]);

  const getFilteredStudents = (
    searchTerm: string,
    paymentFilter: PaymentStatus | "all"
  ) => {
    return studentsWithStatus
      .filter((student) => {
        const hasEnrollments =
          student.enrollments && student.enrollments.length > 0;
        return hasEnrollments;
      })
      .filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (student) =>
          paymentFilter === "all" || student.paymentStatus === paymentFilter
      )
      .sort((a, b) => {
        if (a.paymentStatus === "Paid" && b.paymentStatus !== "Paid") return 1;
        if (b.paymentStatus === "Paid" && a.paymentStatus !== "Paid") return -1;
        return b.dueAmount - a.dueAmount;
      });
  };

  const deleteStudent = async (student: Student) => {
    const { error } = await supabase
      .from("students")
      .update({ deleted: true })
      .eq("id", student.id);

    if (error) {
      console.error("Delete error", error);
      return false;
    }

    await refetch(); // re-fetch data from server
    return true;
  };

  return {
    students: studentsWithStatus,
    paymentStats,
    loading: isLoading,
    fetchStudents: refetch,
    deleteStudent,
    getFilteredStudents,
  };
};
