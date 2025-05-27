"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { supabase } from "@/lib/supabase/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Course = {
  id: string;
  name: string;
};

interface StudentFormProps {
  onSubmit: () => void;
}

export default function StudentForm({ onSubmit }: StudentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [shift, setShift] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name")
        .eq("is_deleted", false);
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setAvailableCourses(data || []);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent if already submitting
    setIsSubmitting(true); // <-- Set submitting true

    try {
      // Insert the student
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert([{ name, email, address, phone, shift, gender }])
        .select()
        .single();

      if (studentError || !studentData) {
        console.error("Failed to add student:", studentError);
        return; // Exit early on error
      }

      // Insert enrollments
      if (courses.length > 0) {
        const enrollments = courses.map((courseId) => ({
          student_id: studentData.id,
          course_id: courseId,
        }));

        const { error: enrollmentError } = await supabase
          .from("enrollments")
          .insert(enrollments);

        if (enrollmentError) {
          console.error(
            "Failed to enroll student in courses:",
            enrollmentError
          );
          return; // Exit early on error
        }
      }

      // Clear form
      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
      setShift("");
      setGender("");
      setCourses([]);

      onSubmit(); // Notify parent
    } finally {
      setIsSubmitting(false); // <-- Always reset submitting state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select onValueChange={setGender} value={gender}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Shift</Label>
        <Select onValueChange={setShift} value={shift}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8:30 to 10:00">8:30 to 10:00</SelectItem>
            <SelectItem value="11:00 to 12:30">11:00 to 12:30</SelectItem>
            <SelectItem value="12:30 to 2:00">12:30 to 2:00</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Enrolled Courses</Label>
        <MultiSelect
          options={availableCourses.map((course) => ({
            label: course.name,
            value: course.id,
          }))}
          selected={courses}
          onChange={setCourses}
          placeholder="Select one or more courses"
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
