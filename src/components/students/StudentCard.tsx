// components/students/StudentCard.tsx
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CardListItem } from "@/components/CardListItem";
import { Student } from "@/lib/supabase/studentHelpers";
import { PaymentBadge } from "./PaymentBadge";
import ViewStudentDialog from "./ViewStudentDialog";
import EditStudentsDialog from "../EditStudentsDialog";

interface StudentCardProps {
  student: Student & {
    dueAmount: number;
    paymentStatus: "Paid" | "Due" | "Partial";
  };
  onDelete: (student: Student) => void;
}

export const StudentCard = ({ student, onDelete }: StudentCardProps) => {
  const getAvatarUrl = (gender?: string) => {
    if (!gender) return "/avatars/neutral-avatar.jpg";
    const genderLower = gender.toLowerCase();
    if (genderLower === "male") return "/avatars/male-avatar.jpg";
    if (genderLower === "female") return "/avatars/female-avatar.jpg";
    return "/avatars/neutral-avatar.jpg";
  };
  const courseNames =
    student.courses?.map((c) => c.name).join(", ") || "No courses";
  return (
    <CardListItem
      key={student.id}
      avatarUrl={getAvatarUrl(student.gender)}
      title={student.name}
      subtitle={`${student.email} — ${student.shift || "No shift"}`}
      extraInfo={
        <>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">
              Courses: {courseNames}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">
              Total Fees: ₹{(student.totalFees || 0).toFixed(2)}
            </span>
            <span className="text-sm">
              Paid: ₹{(student.totalPaid || 0).toFixed(2)}
            </span>
            <PaymentBadge status={student.paymentStatus} />
            {student.paymentStatus !== "Paid" && (
              <span className="text-sm text-red-600 font-semibold">
                Due: ₹{student.dueAmount.toFixed(2)}
              </span>
            )}
          </div>
        </>
      }
    >
      <div className="flex gap-2">
        <ViewStudentDialog student={student} />
        <EditStudentsDialog student={student} onUpdated={() => {}} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{student.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(student)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardListItem>
  );
};
