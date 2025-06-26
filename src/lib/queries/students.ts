import { fetchStudentsWithPayments } from "@/lib/supabase/studentHelpers";

export const getStudentsQuery = async () => {
  return await fetchStudentsWithPayments();
};
