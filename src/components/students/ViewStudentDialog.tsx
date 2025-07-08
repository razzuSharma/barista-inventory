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

type Course = { id: string; name: string; duration?: string };
type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  parentsName: string;
  parentsPhone: string;
  gender: string;
  shift: string;
  educationLevel: string;
  start_date?: string;
  end_date?: string;
  courses?: Course[];
};

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
    <div className="flex items-center gap-4">
      <div className="text-blue-600 dark:text-blue-400 mt-1">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function CoursePill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-blue-200 text-blue-900 dark:bg-blue-900/60 dark:text-blue-300 shadow-md hover:scale-105 transform transition-transform">
      {name}
    </span>
  );
}

const ViewStudentDialog = ({ student }: { student: Student }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="premium" size="lg" className="font-bold tracking-wide">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <DialogHeader className="px-12 pt-12 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {student.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive Student Profile & Enrollment Details
          </DialogDescription>
        </DialogHeader>

        <div className="p-10 space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
            <div className="space-y-8">
              <DetailItem
                label="Email"
                value={student.email}
                icon={<MailIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Phone"
                value={student.phone}
                icon={<PhoneIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Address"
                value={student.address}
                icon={<HomeIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Parents Name"
                value={student.parentsName}
                icon={<UserIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Parents Phone"
                value={student.parentsPhone}
                icon={<PhoneIcon className="w-7 h-7" />}
              />
            </div>

            <div className="space-y-8">
              <DetailItem
                label="Gender"
                value={student.gender}
                icon={<UserIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Shift"
                value={student.shift}
                icon={<ClockIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Education Level"
                value={student.educationLevel}
                icon={<BookOpenIcon className="w-7 h-7" />}
              />
              <DetailItem
                label="Enrollment Period"
                value={
                  student.start_date && student.end_date
                    ? `${new Date(
                        student.start_date
                      ).toLocaleDateString()} - ${new Date(
                        student.end_date
                      ).toLocaleDateString()}`
                    : "-"
                }
                icon={<ClockIcon className="w-7 h-7" />}
              />

              {student.courses && student.courses.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-3 text-2xl font-bold text-blue-700 dark:text-blue-400 mb-5 tracking-wide">
                    <ClockIcon className="w-7 h-7" />
                    Course Durations
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {student.courses.map((course: Course) => (
                      <span
                        key={course.id}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg px-5 py-2 text-gray-800 dark:text-gray-300 font-semibold shadow-sm"
                      >
                        {course.duration || "N/A"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {student.courses && student.courses.length > 0 && (
            <section>
              <h4 className="flex items-center gap-4 text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 tracking-wide">
                <BookOpenIcon className="w-8 h-8" />
                Enrolled Courses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {student.courses.map((course: Course) => (
                  <CoursePill key={course.id} name={course.name} />
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentDialog;
