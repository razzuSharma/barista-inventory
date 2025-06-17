"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
}: {
  payments: any[];
  onEdit?: (payment: any) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow overflow-auto">
      <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p, index) => (
            <TableRow key={p.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{p.enrollment?.student?.name || "Unknown"}</TableCell>
              <TableCell>{p.enrollment?.course?.name || "Unknown"}</TableCell>
              <TableCell>{format(new Date(p.payment_date), "dd MMM yyyy")}</TableCell>
              <TableCell>₹{p.amount}</TableCell>
              <TableCell>{p.payment_method}</TableCell>
              <TableCell>{p.remarks || "-"}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit?.(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete?.(p.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
