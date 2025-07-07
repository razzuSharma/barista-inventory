import { supabase } from "@/lib/supabase/supabase";

export const fetchTotalPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("amount")
    .eq("deleted", false);

  if (error) throw error;
  return data || [];
};

export const fetchTotalExpenses = async () => {
  const { data, error } = await supabase.from("expenses").select("amount");

  if (error) throw error;
  return data || [];
};
