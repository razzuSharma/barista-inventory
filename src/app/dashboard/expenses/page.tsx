"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddExpenseDialog } from "@/components/expenses/add-expenses-dialog";
import { EditExpenseDialog } from "@/components/expenses/edit-expenses-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export type Expense = {
  bill_number: React.ReactNode;
  id: string;
  amount: number;
  date: string;
  source: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <AddExpenseDialog onExpenseAdded={fetchExpenses} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{totalExpenses.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entries Count</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {expenses.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Recent</CardTitle>
          </CardHeader>
          <CardContent className="text-md">
            {expenses[0]?.source || "No entries yet"}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-black border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">S.N</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Amount (₹)</th>
              <th className="px-4 py-2 text-left">Bill Number</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={exp.id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{exp.source}</td>
                <td className="px-4 py-2">₹{exp.amount}</td>
                <td className="px-4 py-2">{exp.bill_number}</td>
                <td className="px-4 py-2 flex gap-2">
                  <EditExpenseDialog expense={exp} onExpenseUpdated={fetchExpenses} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" title="Delete Expense">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500">Delete Expense?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this expense? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const { error } = await supabase.from('expenses').delete().eq('id', exp.id);
                            if (!error) fetchExpenses();
                            else alert('Failed to delete expense.');
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  No expense records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
