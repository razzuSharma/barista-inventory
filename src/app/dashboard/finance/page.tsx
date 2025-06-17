// app/dashboard/finance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsChart } from "@/components/finance/payments-chart";
import { PaymentsTable } from "@/components/finance/payments-table";
import { AddPaymentDialog } from "@/components/finance/add-payment-dialog";
import { EditPaymentDialog } from "@/components/finance/edit-payment-dialog";
import { IconMan } from "@tabler/icons-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);

  const fetchPayments = async () => {
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
    } else {
      setPayments(data);
    }
    if (!error && data) setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("payments")
      .update({ deleted: true })
      .eq("id", id);
    if (!error) fetchPayments();
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
  };

  const handleEditSave = () => {
    setEditingPayment(null);
    fetchPayments();
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Incoming Fees</h1>
        <AddPaymentDialog onPaymentAdded={fetchPayments} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Received</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{totalAmount.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Due</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {/* ₹{totalAmount.toLocaleString()} */}₹1200
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cleared</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold flex">
            <IconMan />
            <p className="px-2">5</p>
          </CardContent>
        </Card>
      </div>

      <PaymentsChart payments={payments} />
      <PaymentsTable
        payments={payments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingPayment && (
        <EditPaymentDialog
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
