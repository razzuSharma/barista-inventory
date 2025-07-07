import { useQuery } from "@tanstack/react-query";
import { fetchTotalPayments, fetchTotalExpenses } from "@/lib/supabase/finance";

export const useFinanceData = () => {
  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["payments", "total"],
    queryFn: fetchTotalPayments,
  });

  const { data: expenses = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses", "total"],
    queryFn: fetchTotalExpenses,
  });

  const totalIncome = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const profit = totalIncome - totalExpenses;

  return {
    loading: loadingPayments || loadingExpenses,
    totalIncome,
    totalExpenses,
    profit,
  };
};
