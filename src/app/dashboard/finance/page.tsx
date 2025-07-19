"use client";

import { useState } from "react";
import {
  usePayments,
  usePaymentTotals,
  useDeletePayment,
} from "@/lib/queries/paymentQueries";
import { PaymentData } from "@/lib/repositories/paymentRepository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsChart } from "@/components/finance/payments-chart";
import { PaymentsTable } from "@/components/finance/payments-table";
import { AddPaymentDialog } from "@/components/finance/add-payment-dialog";
import { EditPaymentDialog } from "@/components/finance/edit-payment-dialog";
import { IconMan } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Define Payment type locally for mapping
type Payment = {
  id: string;
  enrollment: {
    student: { name: string };
    course: { name: string };
  };
  payment_date: string;
  amount: number;
  payment_method: string;
  remarks: string;
};

export default function PaymentsPage() {
  const [editingPayment, setEditingPayment] = useState<PaymentData | null>(
    null
  );

  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = usePayments();

  const {
    data: totals = { totalReceived: 0, fullyPaidCount: 0, totalDue: 0 },
    isLoading: totalsLoading,
  } = usePaymentTotals();

  const deletePaymentMutation = useDeletePayment();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deletePaymentMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete payment:", error);
        // You could add a toast notification here
      }
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment as unknown as PaymentData);
  };

  const handleEditClose = () => {
    setEditingPayment(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Map PaymentData[] to Payment[] for type compatibility
  const mappedPayments = payments.map((p: PaymentData) => ({
    ...p,
    payment_method: (p as unknown as Payment).payment_method?.toString() ?? "",
    enrollment: {
      ...p.enrollment,
      student: p.enrollment?.student ?? { name: "" },
      course: p.enrollment?.course ?? { name: "" },
    },
    remarks: p.remarks ?? "",
  }));

  // Calculate Active Payers (unique students who have made at least one payment)
  const activePayers = new Set(payments.map((p: PaymentData) => p.enrollment?.student?.id)).size;

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-red-800 font-semibold text-lg mb-2">
            Error Loading Payments
          </h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load payments"}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Incoming Fees</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <AddPaymentDialog />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Received</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalsLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              `₹${totals.totalReceived.toFixed(2)}`
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Due</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalsLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              `₹${totals.totalDue.toFixed(2)}`
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Payers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold flex items-center">
            <IconMan />
            {totalsLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded ml-2"></div>
            ) : (
              <p className="px-2">{activePayers}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Loading skeleton for chart */}
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>

          {/* Loading skeleton for table */}
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-12 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-16 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <PaymentsChart payments={mappedPayments} />
          <PaymentsTable
            payments={mappedPayments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {editingPayment && (
        <EditPaymentDialog payment={editingPayment} onClose={handleEditClose} />
      )}

      {/* Background refresh indicator */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Refreshing...
        </div>
      )}
    </div>
  );
}
