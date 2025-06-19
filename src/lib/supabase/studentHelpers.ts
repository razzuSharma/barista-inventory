import { supabase } from "@/lib/supabase/supabase";

export interface Course {
  id: string;
  name: string;
  duration: string;
  price: number | null;
}

export interface Payment {
  amount: number;
}

export interface Enrollment {
  id: string;
  course: Course | null;
  payments: Payment[] | null;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  start_date?: string;
  end_date?: string;
  shift?: string;
  gender?: string;
  deleted?: boolean;
  enrollments?: Enrollment[];

  // Calculated properties:
  courses?: Course[];
  totalPaid?: number;
  totalFees?: number;
  paymentStatus?: "Paid" | "Due" | "Partial";
}

export const fetchStudentsWithPayments = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      *,
      enrollments (
        id,
        course: courses ( id, name, duration, price ), 
        payments: payments!fk_enrollments ( amount )
      )
    `
    )
    .eq("deleted", false);

  if (error) {
    console.error("Fetch error", error);
    return [];
  }

  // Type assertion helps TypeScript
  const students = data as Student[];

  return students.map((student) => {
    const enrollments = student.enrollments || [];

    // Sum total paid for all enrollments
    const totalPaid = enrollments.reduce((sum, enrollment) => {
      const enrollmentPayments = enrollment.payments || [];
      return (
        sum +
        enrollmentPayments.reduce((acc, payment) => acc + Number(payment.amount), 0)
      );
    }, 0);

    // Sum total fees from courses' price (use price, not duration)
    const totalFees = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.price ?? 0);
    }, 0);

    let status: Student["paymentStatus"] = "Paid";
    if (totalPaid === 0) status = "Due";
    else if (totalPaid < totalFees) status = "Partial";

    return {
      ...student,
      courses: enrollments.map((e) => e.course).filter(Boolean) as Course[],
      totalPaid,
      totalFees,
      paymentStatus: status,
    };
  });
};
