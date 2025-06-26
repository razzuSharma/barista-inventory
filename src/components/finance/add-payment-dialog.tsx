"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
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
import { useEnrollments, useCreatePayment } from "@/lib/queries/paymentQueries";
import { EnrollmentData } from "@/lib/repositories/enrollmentsRepository";
import { Plus } from "lucide-react";

export function AddPaymentDialog() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TanStack Query hooks
  const {
    data: enrollments = [],
    isLoading: isLoadingEnrollments,
    refetch: refetchEnrollments,
  } = useEnrollments();
  const createPaymentMutation = useCreatePayment();

  const validateForm = (): string | null => {
    if (!enrollmentId) {
      return "Please select an enrollment";
    }
    if (!paymentMethod) {
      return "Please select a payment method";
    }
    if (!paymentDate) {
      return "Please select the payment date";
    }
    if (!amount || parseFloat(amount) <= 0) {
      return "Please enter a valid amount";
    }
    return null;
  };

  const resetForm = () => {
    setAmount("");
    setPaymentMethod("");
    setDiscount("");
    setPaymentDate("");
    setRemarks("");
    setEnrollmentId("");
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError); // In production, use a proper toast/notification
      return;
    }

    try {
      await createPaymentMutation.mutateAsync({
        enrollment_id: enrollmentId,
        amount: parseFloat(amount),
        discount: discount ? parseFloat(discount) : 0,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        remarks: remarks || "",
      });

      // Success - reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create payment:", error);
      // In production, show a proper error toast
      alert(
        error instanceof Error ? error.message : "Failed to create payment"
      );
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (open) {
      refetchEnrollments(); 
    } else {
      resetForm();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>

        {createPaymentMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">
              {createPaymentMutation.error instanceof Error
                ? createPaymentMutation.error.message
                : "Failed to create payment"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Student & Course</Label>
            {isLoadingEnrollments ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-gray-600">
                  Loading enrollments...
                </span>
              </div>
            ) : (
              <Select value={enrollmentId} onValueChange={setEnrollmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student & course" />
                </SelectTrigger>
                <SelectContent>
                  {enrollments.map((enrollment: EnrollmentData) => (
                    <SelectItem key={enrollment.id} value={enrollment.id}>
                      {enrollment.students?.name} - {enrollment.courses?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            />
          </div>

          <div className="space-y-2">
            <Label>Discount</Label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount (if any)"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
            <Label>Paid On</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={createPaymentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPaymentMutation.isPending || isLoadingEnrollments}
          >
            {createPaymentMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
