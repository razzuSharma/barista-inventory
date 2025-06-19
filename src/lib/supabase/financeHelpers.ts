// lib/supabase/financeHelpers.ts

import { supabase } from "./supabase";

export async function fetchPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
    *,
    enrollment:enrollments (
      id,
      student:students (id, name),
      course:courses (id, name)
    )
  `
    )
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
  return data;
}

export async function softDeletePayment(id: string) {
  const { error } = await supabase
    .from("payments")
    .update({ deleted: true })
    .eq("id", id);

  if (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
}

export function calculateTotals(payments: any[]) {
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);

  const enrollmentPayments = new Map<string, number>();
  const fullPayments = new Set<string>();

  for (const p of payments) {
    const enrollmentId = p.enrollment.id;
    const coursePrice = p.enrollment.course?.price || 0;

    const prevAmount = enrollmentPayments.get(enrollmentId) || 0;
    const total = prevAmount + p.amount;

    enrollmentPayments.set(enrollmentId, total);

    if (total >= coursePrice) fullPayments.add(enrollmentId);
  }

  return {
    totalReceived,
    fullyPaidCount: fullPayments.size,
    totalDue:
      [...enrollmentPayments.entries()].reduce((acc, [id, paid]) => {
        const coursePrice = payments.find(p => p.enrollment.id === id)?.enrollment.course?.price || 0;
        return acc + Math.max(0, coursePrice - paid);
      }, 0)
  };
}
