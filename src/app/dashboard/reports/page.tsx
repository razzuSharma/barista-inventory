"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePaymentReport } from "@/lib/supabase/reportHelpers";
export default function ReportSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    const result = await generatePaymentReport(startDate, endDate);
    setReport(result);
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
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button onClick={handleGenerate}>Generate Report</Button>
      </div>

      {report && (
        <div className="mt-6 space-y-2 border-t pt-4">
          <h3 className="text-lg font-semibold">Report Summary:</h3>
          <p>Total Received: ₹{report.total_received.toFixed(2)}</p>
          <p>Total Discount: ₹{report.total_discount.toFixed(2)}</p>
          <p>Total Transactions: {report.total_transactions}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Payments:</h4>
            <ul className="text-sm list-disc list-inside">
              {report.payments.map((p: any, index: number) => (
                <li key={index}>
                  ₹{p.amount.toFixed(2)} on {p.payment_date}{" "}
                  {p.discount ? `(Discount: ₹${p.discount.toFixed(2)})` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
