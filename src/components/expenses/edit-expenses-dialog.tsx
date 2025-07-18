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
import { supabase } from "@/lib/supabase/supabase";

import type { Expense } from "@/app/dashboard/expenses/page";

interface EditExpenseDialogProps {
  expense: Expense;
  onExpenseUpdated: () => void;
}

export function EditExpenseDialog({ expense, onExpenseUpdated }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(expense.date);
  const [source, setSource] = useState(expense.source);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [billNumber, setBillNumber] = useState(expense.bill_number ? String(expense.bill_number) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !source || !amount || parseFloat(amount) <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("expenses").update({
      date,
      source,
      amount: parseFloat(amount),
      bill_number: billNumber || null,
    }).eq("id", expense.id);

    setIsSubmitting(false);

    if (!error) {
      onExpenseUpdated();
      setOpen(false);
    } else {
      console.error("Error updating expense:", error);
      alert("Failed to update expense.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="ml-2" title="Edit Expense">
          ✏️
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Source of Expense</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Utilities, Supplies, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Amount (NPR)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Bill Number (Optional)</Label>
            <Input
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="e.g. INV-1234"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 