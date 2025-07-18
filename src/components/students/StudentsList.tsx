// components/students/StudentsList.tsx
import { Student } from "@/lib/supabase/studentHelpers";
import { StudentCard } from "./StudentCard";

interface StudentsListProps {
  students: (Student & {
    dueAmount: number;
    paymentStatus: "Paid" | "Due" | "Partial";
  })[];
  onDelete: (student: Student) => void;
}

export const StudentsList = ({ students, onDelete }: StudentsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        Enrolled Students ({students.length})
      </h3>
      <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm dark:bg-gray-800">
        {students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={
                student as unknown as Student & {
                  dueAmount: number;
                  paymentStatus: "Paid" | "Due" | "Partial";
                  parentsName: string;
                  parentsPhone: string;
                  educationLevel: string;
                }
              }
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No enrolled students found.</p>
        )}
      </div>
    </div>
  );
};
