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

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  className?: string; // Add this line
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

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("id, name");
      if (!error && data) {
        setAvailableCourses(data);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert student
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .insert([{ name, email, address, phone, shift, gender }])
      .select()
      .single();

    if (studentError || !studentData) {
      console.error("Failed to add student:", studentError);
      return;
    }

    // Link courses if selected
    if (courses.length > 0) {
      const enrollments = courses.map((courseId) => ({
        student_id: studentData.id,
        course_id: courseId,
      }));

      const { error: enrollmentError } = await supabase
        .from("student_courses")
        .insert(enrollments);

      if (enrollmentError) {
        console.error("Failed to enroll in courses:", enrollmentError);
      }
    }

    // Reset and notify parent
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setShift("");
    setGender("");
    setCourses([]);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Gender</Label>
        <Select onValueChange={setGender} value={gender}>
          <SelectTrigger className="w-full rounded-md border border-input px-3 py-2 text-sm">
            <SelectValue placeholder="Choose a gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="shift">Shift</Label>
        <Select onValueChange={setShift} value={shift}>
          <SelectTrigger className="w-full rounded-md border border-input px-3 py-2 text-sm">
            <SelectValue placeholder="Choose a shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8:30 to 10:00">8:30 to 10:00</SelectItem>
            <SelectItem value="11:00 to 12:30">11:00 to 12:30</SelectItem>
            <SelectItem value="12:30 to 2:00">12:30 to 2:00</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="courses">Enrolled Courses</Label>
        <MultiSelect
          options={availableCourses.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          selected={courses}
          onChange={setCourses}
          placeholder="Select one or more courses"
          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
