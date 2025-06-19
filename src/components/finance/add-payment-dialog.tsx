"use client";
import { useEffect, useState, SetStateAction } from "react";
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
import { supabase } from "@/lib/supabase/supabase";

interface AddPaymentDialogProps {
  onPaymentAdded: () => void;
}

export function AddPaymentDialog({ onPaymentAdded }: AddPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [payment_date, setPaymentDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEnrollments = async () => {
    const { data, error } = await supabase.from("enrollments").select(
      `
        id,
        student_id,
        course_id,
        students (
          id,
          name
        ),
        courses (
          id,
          name
        )
      `
    );
    console.log("first", data);

    if (!error && data) {
      setEnrollments(data);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleSubmit = async () => {
    if (!enrollmentId) {
      alert("Please select an enrollment");
      return;
    }
    if (!payment_method) {
      alert("Please select a payment method");
      return;
    }
    if (!payment_date) {
      alert("Please select the payment date");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("payments").insert({
      enrollment_id: enrollmentId,
      amount: parseFloat(amount),
      discount: discount ? parseFloat(discount) : 0,
      payment_method: payment_method,
      payment_date: payment_date,
      remarks,
    });

    setIsSubmitting(false);

    if (!error) {
      onPaymentAdded(); // Refresh data in parent
      // Reset fields
      setAmount("");
      setPayment_method("");
      setDiscount(""); 
      setPaymentDate("");
      setRemarks("");
      setEnrollmentId("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Student & Course</Label>
            <Select
              value={enrollmentId}
              onValueChange={setEnrollmentId}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student & course" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id}>
                    {enrollment.students?.name} - {enrollment.courses?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount</Label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount (if any)"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={payment_method}
              onValueChange={setPayment_method}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">CASH</SelectItem>
                <SelectItem value="ESEWA">ESEWA</SelectItem>
                <SelectItem value="BANKING">BANKING</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Paid On</Label>
            <Input
              type="date"
              value={payment_date}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setRemarks(e.target.value)
              }
              placeholder="Optional remarks"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
