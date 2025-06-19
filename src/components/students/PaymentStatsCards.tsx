// components/students/PaymentStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
interface PaymentStats {
  total: number;
  paid: number;
  partial: number;
  due: number;
  totalDueAmount: number;
}

export const PaymentStatsCards = ({ stats }: { stats: PaymentStats }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Enrolled</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Fully Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Partial Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Payment Due</p>
            <p className="text-2xl font-bold text-red-600">{stats.due}</p>
          </CardContent>
        </Card>
      </div>

      {stats.totalDueAmount > 0 && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Outstanding Amount</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{stats.totalDueAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};