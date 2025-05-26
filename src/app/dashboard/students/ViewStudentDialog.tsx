"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";

// DetailItem component
function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-gray-900 dark:text-white font-medium">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

// CoursePill component
function CoursePill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
      {name}
    </span>
  );
}

const ViewStudentDialog = ({ student }: { student: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="premium" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">{student.name}</DialogTitle>
          <DialogDescription>Detailed Student Information</DialogDescription>
        </DialogHeader>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <DetailItem
                  label="Email"
                  value={student.email}
                  icon={<MailIcon className="w-5 h-5" />}
                />
                <DetailItem
                  label="Phone"
                  value={student.phone}
                  icon={<PhoneIcon className="w-5 h-5" />}
                />
                <DetailItem
                  label="Address"
                  value={student.address}
                  icon={<HomeIcon className="w-5 h-5" />}
                />
              </div>
              <div className="space-y-3">
                <DetailItem
                  label="Gender"
                  value={student.gender}
                  icon={<UserIcon className="w-5 h-5" />}
                />
                <DetailItem
                  label="Shift"
                  value={student.shift}
                  icon={<ClockIcon className="w-5 h-5" />}
                />
              </div>
            </div>

            {student.courses?.length > 0 && (
              <div className="pt-2">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Enrolled Courses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {student.courses.map((course: any) => (
                    <CoursePill key={course.id} name={course.name} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentDialog;
