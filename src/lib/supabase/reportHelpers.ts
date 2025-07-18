import { supabase } from "@/lib/supabase/supabase";

export async function generatePaymentReport(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("amount, discount, payment_date")
    .gte("payment_date", startDate)
    .lte("payment_date", endDate)
    .eq("deleted", false); // 

  if (error) {
    console.error("Report fetch error", error);
    return null;
  }

  const totalReceived = data.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDiscount = data.reduce((sum, p) => sum + (p.discount || 0), 0);
  const totalTransactions = data.length;

  return {
    total_received: totalReceived,
    total_discount: totalDiscount,
    total_transactions: totalTransactions,
    payments: data,
  };
}

export async function generateExpenseReport(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, date")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Expense report fetch error", error);
    return null;
  }

  const totalExpense = data.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalTransactions = data.length;

  return {
    total_expense: totalExpense,
    total_transactions: totalTransactions,
    expenses: data,
  };
}
