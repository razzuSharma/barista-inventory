"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Payment = { amount: number; payment_date: string };

export function PaymentsChart({ payments }: { payments: Payment[] }) {
  const grouped = payments.reduce((acc: Record<string, number>, p) => {
    const date = p.payment_date.split("T")[0];
    acc[date] = (acc[date] || 0) + p.amount;
    return acc;
  }, {});

  const labels = Object.keys(grouped).sort();
  const data = labels.map((label) => grouped[label]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false as const, // Allow height control
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Payments Over Time</h2>
      <div className="h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
