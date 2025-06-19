import { supabase } from "@/lib/supabase/supabase";

export interface Course {
  id: string;
  name: string;
  duration: string;
  price: number | null;
}

export interface Payment {
  amount: number;
  discount?: number | null;
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
        payments: payments!fk_enrollments ( amount, discount )
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

    const totalPaid = enrollments.reduce((sum, enrollment) => {
      const enrollmentPayments = enrollment.payments || [];
      return (
        sum + enrollmentPayments.reduce((acc, p) => acc + Number(p.amount), 0)
      );
    }, 0);

    // Total course price
    const rawFees = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.price ?? 0);
    }, 0);

    // Total discount
    const totalDiscount = enrollments.reduce((sum, enrollment) => {
      const payments = enrollment.payments || [];
      return sum + payments.reduce((acc, p) => acc + (p.discount ?? 0), 0);
    }, 0);

    const totalFees = rawFees - totalDiscount;

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
