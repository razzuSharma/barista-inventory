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
    <div className="flex items-start gap-4">
      <span className="text-blue-500 dark:text-blue-400 mt-1">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
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
    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm">
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
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-2">
          <DialogTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {student.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed Student Information
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden m-6 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-6">
                <DetailItem
                  label="Email"
                  value={student.email}
                  icon={<MailIcon className="w-6 h-6" />}
                />
                <DetailItem
                  label="Phone"
                  value={student.phone}
                  icon={<PhoneIcon className="w-6 h-6" />}
                />
                <DetailItem
                  label="Address"
                  value={student.address}
                  icon={<HomeIcon className="w-6 h-6" />}
                />
              </div>
              <div className="space-y-6">
                <DetailItem
                  label="Gender"
                  value={student.gender}
                  icon={<UserIcon className="w-6 h-6" />}
                />
                <DetailItem
                  label="Shift"
                  value={student.shift}
                  icon={<ClockIcon className="w-6 h-6" />}
                />

                {student.courses?.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-400 mb-3">
                      <ClockIcon className="w-6 h-6" />
                      Duration
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {student.courses.map((course: any) => (
                        <span
                          key={course.id}
                          className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-1 text-gray-700 dark:text-gray-300 shadow-sm"
                        >
                          {course.duration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {student.courses?.length > 0 && (
              <div className="pt-4">
                <h4 className="flex items-center gap-3 text-xl font-semibold text-blue-700 dark:text-blue-400 mb-3">
                  <BookOpenIcon className="w-6 h-6" />
                  Enrolled Courses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
