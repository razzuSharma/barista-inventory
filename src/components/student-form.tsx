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
  const [parentsName, setParentsName] = useState("");
  const [parentsPhone, setParentsPhone] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone: string) {
    return /^\d{10,15}$/.test(phone.replace(/\D/g, ""));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent if already submitting

    // Client-side validation
    if (!name || !email || !address || !phone || !shift || !gender || !parentsName || !parentsPhone || !educationLevel) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(phone)) {
      setFormError("Please enter a valid phone number (10-15 digits).");
      return;
    }
    if (!validatePhone(parentsPhone)) {
      setFormError("Please enter a valid parent's phone number (10-15 digits).");
      return;
    }
    setFormError(null);
    setIsSubmitting(true); // <-- Set submitting true

    try {
      // Insert the student
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert([
          {
            name,
            email,
            address,
            phone,
            shift,
            gender,
            parentsName,
            parentsPhone,
            educationLevel,
          },
        ])
        .select()
        .single();

      if (studentError || !studentData) {
        setFormError("Failed to add student. Please try again.");
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
          setFormError("Failed to enroll student in courses. Please try again.");
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
      setParentsName("");
      setParentsPhone("");
      setEducationLevel("");
      setCourses([]);

      onSubmit(); // Notify parent
    } finally {
      setIsSubmitting(false); // <-- Always reset submitting state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="text-red-500 text-sm font-medium mb-2">{formError}</div>
      )}
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
        <Label>Parent&apos;s Name</Label>
        <Input
          value={parentsName}
          onChange={(e) => setParentsName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Parent&apos;s Phone</Label>
        <Input
          value={parentsPhone}
          onChange={(e) => setParentsPhone(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Education Level</Label>
        <Input
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
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
