"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePayment } from "@/lib/queries/paymentQueries";
import { PaymentData } from "@/lib/repositories/paymentRepository";

interface EditPaymentDialogProps {
  payment: PaymentData;
  onClose: () => void;
}

export function EditPaymentDialog({
  payment,
  onClose,
}: EditPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // TanStack Query mutation
  const updatePaymentMutation = useUpdatePayment();

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount.toString());
      setPaymentMethod(payment.enrollment.payment_method || "");
      setDate(payment.payment_date ? payment.payment_date.split("T")[0] : "");
      setRemarks(payment.remarks || "");
    }
  }, [payment]);

  const validateForm = (): string | null => {
    if (!amount || parseFloat(amount) <= 0) {
      return "Please enter a valid amount";
    }
    if (!paymentMethod) {
      return "Please select a payment method";
    }
    if (!date) {
      return "Please select a payment date";
    }
    return null;
  };

  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError); // In production, use a proper toast/notification
      return;
    }

    try {
      await updatePaymentMutation.mutateAsync({
        id: payment.id,
        data: {
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          payment_date: date,
          remarks: remarks,
        },
      });

      // Success - close dialog
      onClose();
    } catch (error) {
      console.error("Failed to update payment:", error);
      // In production, show a proper error toast
      alert(
        error instanceof Error ? error.message : "Failed to update payment"
      );
    }
  };

  const handleClose = () => {
    if (updatePaymentMutation.isPending) {
      return; // Prevent closing while mutation is in progress
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>

        {updatePaymentMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">
              {updatePaymentMutation.error instanceof Error
                ? updatePaymentMutation.error.message
                : "Failed to update payment"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Display student and course info (read-only) */}
          <div className="space-y-2">
            <Label>Student & Course</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm border">
              <div className="font-medium">
                {payment.enrollment?.student?.name || "Unknown Student"}
              </div>
              <div className="text-gray-600">
                {payment.enrollment?.course?.name || "Unknown Course"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              disabled={updatePaymentMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={updatePaymentMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="ESEWA">eSewa</SelectItem>
                <SelectItem value="BANKING">Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={updatePaymentMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
              rows={3}
              disabled={updatePaymentMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={updatePaymentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updatePaymentMutation.isPending}
          >
            {updatePaymentMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
