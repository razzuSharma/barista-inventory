// lib/repositories/enrollmentsRepository.ts
import { supabase } from "@/lib/supabase/supabase";

export interface EnrollmentData {
  id: string;
  student_id: string;
  course_id: string;
  students: {
    id: string;
    name: string;
  };
  courses: {
    id: string;
    name: string;
  };
}

export class EnrollmentsRepository {
  async getAll(): Promise<EnrollmentData[]> {
    const { data, error } = await supabase.from("enrollments").select(`
        id,
        student_id,
        course_id,
        students (
          id,
          name
        ),
        courses (
          id,
          name
        )
      `);

    if (error) {
      console.error("Error fetching enrollments:", error);
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }

    return (data as unknown as EnrollmentData[]) || [];
  }

  async getById(id: string): Promise<EnrollmentData | null> {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        student_id,
        course_id,
        students (
          id,
          name
        ),
        courses (
          id,
          name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error fetching enrollment by ID:", error);
      throw new Error(`Failed to fetch enrollment: ${error.message}`);
    }

    return data as unknown as EnrollmentData;
  }
}
