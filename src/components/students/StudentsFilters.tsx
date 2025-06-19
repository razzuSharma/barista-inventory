// components/students/StudentsFilters.tsx
import { IconSearch } from "@tabler/icons-react";

type PaymentStatus = "Paid" | "Due" | "Partial";

interface StudentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentFilter: PaymentStatus | "all";
  onPaymentFilterChange: (value: PaymentStatus | "all") => void;
}

export const StudentsFilters = ({
  searchTerm,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
}: StudentsFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative w-full max-w-md">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 pl-10 border rounded-md"
        />
      </div>

      <select
        value={paymentFilter}
        onChange={(e) => onPaymentFilterChange(e.target.value as PaymentStatus | "all")}
        className="p-2 border rounded-md max-w-xs"
      >
        <option value="all">All Payment Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Partial">Partial</option>
        <option value="Due">Due</option>
      </select>
    </div>
  );
};