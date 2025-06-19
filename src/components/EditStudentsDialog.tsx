"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/supabase";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
}

const EditStudentsDialog = ({
  student,
  onUpdated,
}: {
  student: any;
  onUpdated: () => void;
}) => {
  // Initialize form with student data, selectedCourses as empty array initially
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    gender: "",
    shift: "",
    parentsName: "",
    parentsPhone: "",
    educationLevel: "",
    selectedCourses: [] as string[],
  });

  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Reset form data each time dialog opens, then fetch enrollments & courses
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        // Fetch available courses
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("id, name")
          .eq("is_deleted", false);

        if (coursesError) throw coursesError;

        // Fetch enrolled courses for this student
        const { data: enrollmentsData, error: enrollmentsError } =
          await supabase
            .from("enrollments")
            .select("course_id")
            .eq("student_id", student.id);

        if (enrollmentsError) throw enrollmentsError;

        setAvailableCourses(coursesData || []);

        // Set form fields including selectedCourses as array of course_ids
        setForm({
          name: student.name || "",
          email: student.email || "",
          address: student.address || "",
          phone: student.phone || "",
          gender: student.gender || "",
          shift: student.shift || "",
          parentsName: student.parentsName || "",
          parentsPhone: student.parentsPhone || "",
          educationLevel: student.educationLevel || "",
          selectedCourses: enrollmentsData?.map((e) => e.course_id) || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load student data");
      }
    };

    fetchData();
  }, [isOpen, student]);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select dropdown changes (gender, shift)
  const handleSelectChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Handle MultiSelect changes - ensure 'selected' is always an array of strings
  const handleMultiSelectChange = (selected: string[] | string) => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    setForm((prev) => ({ ...prev, selectedCourses: selectedArray }));
  };

  // Submit updated student info and enrollments
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Update student info
      const { error: updateError } = await supabase
        .from("students")
        .update({
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone,
          gender: form.gender,
          shift: form.shift,
          parents_name: form.parentsName,
          parents_phone: form.parentsPhone,
          education_level: form.educationLevel,
        })
        .eq("id", student.id);

      if (updateError) throw updateError;

      // Step 2: Fetch existing enrollments for this student
      const { data: existingEnrollments, error: fetchEnrollmentsError } =
        await supabase
          .from("enrollments")
          .select("course_id")
          .eq("student_id", student.id);

      if (fetchEnrollmentsError) throw fetchEnrollmentsError;

      const existingCourseIds =
        existingEnrollments?.map((e) => e.course_id) || [];

      // Step 3: Determine which course_ids are newly selected
      const newCourseIds = form.selectedCourses.filter(
        (courseId) => !existingCourseIds.includes(courseId)
      );

      // Step 4: Insert only new enrollments
      if (newCourseIds.length > 0) {
        const newEnrollments = newCourseIds.map((courseId) => ({
          student_id: student.id,
          course_id: courseId,
        }));

        const { error: insertError } = await supabase
          .from("enrollments")
          .insert(newEnrollments);

        if (insertError) throw insertError;
      }

      toast.success("Student updated successfully");
      onUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student info and enrolled courses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Student Email"
            type="email"
            required
          />
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Student Address"
            required
          />
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Student Phone"
            required
          />

          <Input
            name="parentsName"
            value={form.parentsName}
            onChange={handleChange}
            placeholder="Parent's Name"
            required
          />

          <Input
            name="parentsPhone"
            value={form.parentsPhone}
            onChange={handleChange}
            placeholder="Parent's Phone"
            required
          />

          <Input
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
            placeholder="Education Level"
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={(e) => handleSelectChange("gender", e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <select
            name="shift"
            value={form.shift}
            onChange={(e) => handleSelectChange("shift", e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select Shift
            </option>
            <option value="8:30 to 10:00">8:30 to 10:00</option>
            <option value="11:00 to 12:30">11:00 to 12:30</option>
            <option value="12:30 to 2:00">12:30 to 2:00</option>
          </select>

          <div className="space-y-2">
            <Label>Enrolled Courses</Label>
            <MultiSelect
              options={availableCourses.map((course) => ({
                label: course.name,
                value: course.id,
              }))}
              selected={form.selectedCourses}
              onChange={handleMultiSelectChange}
              placeholder="Select one or more courses"
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentsDialog;
