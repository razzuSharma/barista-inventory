"use client";

import { useEffect, useState } from "react";
import {
  fetchPayments,
  softDeletePayment,
  calculateTotals,
} from "@/lib/supabase/financeHelpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentsChart } from "@/components/finance/payments-chart";
import { PaymentsTable } from "@/components/finance/payments-table";
import { AddPaymentDialog } from "@/components/finance/add-payment-dialog";
import { EditPaymentDialog } from "@/components/finance/edit-payment-dialog";
import { IconMan } from "@tabler/icons-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);

  const loadPayments = async () => {
    try {
      const data = await fetchPayments();
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleDelete = async (id: string) => {
    await softDeletePayment(id);
    loadPayments();
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
  };

  const handleEditSave = () => {
    setEditingPayment(null);
    loadPayments();
  };

  const { totalReceived, fullyPaidCount, totalDue } = calculateTotals(payments);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Incoming Fees</h1>
        <AddPaymentDialog onPaymentAdded={loadPayments} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Received</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{totalReceived.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Due</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{totalDue.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cleared</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold flex">
            <IconMan />
            <p className="px-2">{fullyPaidCount}</p>
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
