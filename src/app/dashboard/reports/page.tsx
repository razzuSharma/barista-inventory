"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePaymentReport } from "@/lib/supabase/reportHelpers";
import { generateExpenseReport } from "@/lib/supabase/reportHelpers";
import { addDays, format, eachDayOfInterval } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type Payment = { amount: number; payment_date: string; discount: number };
type Report = {
  payments: Payment[];
  total_received: number;
  total_discount: number;
  total_transactions: number;
  expenses: any[]; // Assuming expense type is similar to payment
  total_expense: number;
  expense_transactions: number;
};

export default function ReportSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  // Helper to get today and one month later in yyyy-mm-dd
  function getToday() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  function getOneMonthLater(dateStr: string) {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  }

  // Load from localStorage or use defaults
  useEffect(() => {
    const savedStart = localStorage.getItem("reportStartDate");
    const savedEnd = localStorage.getItem("reportEndDate");
    let initialStart = savedStart || getToday();
    let initialEnd = savedEnd || getOneMonthLater(initialStart);
    setStartDate(initialStart);
    setEndDate(initialEnd);
  }, []);

  // Persist on change
  useEffect(() => {
    if (startDate) {
      localStorage.setItem("reportStartDate", startDate);
      const newEnd = getOneMonthLater(startDate);
      setEndDate(newEnd);
      localStorage.setItem("reportEndDate", newEnd);
    }
  }, [startDate]);

  // Load report from localStorage on mount
  useEffect(() => {
    const savedReport = localStorage.getItem("reportData");
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
      } catch {}
    }
  }, []);

  // Save report to localStorage whenever it changes
  useEffect(() => {
    if (report) {
      localStorage.setItem("reportData", JSON.stringify(report));
    }
  }, [report]);

  // Auto-generate and update report daily
  useEffect(() => {
    if (!startDate || !endDate) return;
    let interval: NodeJS.Timeout;
    const fetchReport = async () => {
      const paymentResult = await generatePaymentReport(startDate, endDate);
      const expenseResult = await generateExpenseReport(startDate, endDate);
      if (!paymentResult || !expenseResult) return;
      setReport({
        payments: paymentResult.payments,
        total_received: paymentResult.total_received,
        total_discount: paymentResult.total_discount,
        total_transactions: paymentResult.total_transactions,
        expenses: expenseResult.expenses,
        total_expense: expenseResult.total_expense,
        expense_transactions: expenseResult.total_transactions,
      });
    };
    fetchReport();
    // Update every day at midnight
    interval = setInterval(() => {
      fetchReport();
    }, 1000 * 60 * 60 * 24); // 24 hours
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }
    const paymentResult = await generatePaymentReport(startDate, endDate);
    const expenseResult = await generateExpenseReport(startDate, endDate);
    if (!paymentResult || !expenseResult) return;
    setReport({
      payments: paymentResult.payments,
      total_received: paymentResult.total_received,
      total_discount: paymentResult.total_discount,
      total_transactions: paymentResult.total_transactions,
      expenses: expenseResult.expenses,
      total_expense: expenseResult.total_expense,
      expense_transactions: expenseResult.total_transactions,
    });
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Generate Closing Balance Report</h2>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Input
          type="date"
          value={endDate}
          disabled
          className="w-full sm:w-1/3 opacity-60 cursor-not-allowed"
        />
        <Button onClick={handleGenerate}>Generate Report</Button>
      </div>

      {report && (
        <div className="mt-6 space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6 items-center justify-between border border-gray-200 dark:border-gray-700">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Total Income</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{report.total_received.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Total Expense</span>
                <span className="text-2xl font-bold text-red-500 dark:text-red-400">
                  ₹{report.total_expense.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Net</span>
                <span
                  className={`text-2xl font-bold ${
                    report.total_received - report.total_expense >= 0
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  ₹{(report.total_received - report.total_expense).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Income Txns</span>
                <span className="text-lg font-semibold">
                  {report.total_transactions}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Expense Txns</span>
                <span className="text-lg font-semibold">
                  {report.expense_transactions}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Total Discount</span>
                <span className="text-lg font-semibold text-blue-500 dark:text-blue-400">
                  ₹{report.total_discount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive chart for daily income/expense */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">
              Income & Expense Chart
            </h4>
            {(() => {
              if (!startDate || !endDate) return null;
              const days = eachDayOfInterval({
                start: new Date(startDate),
                end: new Date(endDate),
              });
              const chartData = days.map((d) => {
                const dateStr = format(d, "yyyy-MM-dd");
                const income = report.payments
                  .filter((p: any) => p.payment_date === dateStr)
                  .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
                const expense = report.expenses
                  .filter((e: any) => e.date === dateStr)
                  .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
                return { date: dateStr, income, expense };
              });
              return (
                <ChartContainer
                  config={{
                    income: { label: "Income", color: "#22c55e" },
                    expense: { label: "Expense", color: "#ef4444" },
                  }}
                  className="h-72 w-full"
                >
                  <AreaChart
                    data={chartData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="incomeColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="expenseColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip
                      formatter={(value: number) => `₹${value.toFixed(2)}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#incomeColor)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#expenseColor)"
                      name="Expense"
                    />
                  </AreaChart>
                </ChartContainer>
              );
            })()}
          </div>

          {/* Payments and Expenses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                Payments
              </h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                {report.payments.map((p: Payment, index: number) => (
                  <li key={index}>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      ₹{p.amount.toFixed(2)}
                    </span>{" "}
                    on{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {p.payment_date}
                    </span>
                    {p.discount ? (
                      <span className="ml-2 text-blue-500">
                        (Discount: ₹{p.discount.toFixed(2)})
                      </span>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                Expenses
              </h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                {report.expenses.map((e: any, index: number) => (
                  <li key={index}>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      ₹{e.amount.toFixed(2)}
                    </span>{" "}
                    on{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {e.date}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
