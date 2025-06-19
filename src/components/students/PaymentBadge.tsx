import { Student } from "@/lib/supabase/studentHelpers";
type PaymentStatus = "Paid" | "Due" | "Partial";

export const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold inline-block";
  
  const statusStyles = {
    Paid: "bg-green-100 text-green-800",
    Due: "bg-red-100 text-red-800",
    Partial: "bg-yellow-100 text-yellow-800"
  };

  return (
    <span className={`${baseClasses} ${statusStyles[status]}`}>
      {status}
    </span>
  );
};