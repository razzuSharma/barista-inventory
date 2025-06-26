// lib/repositories/paymentsRepository.ts
import { supabase } from "@/lib/supabase/supabase";

export interface PaymentData {
  remarks: string;
  id: string;
  amount: number;
  payment_date: string;
  deleted: boolean;
  enrollment: {
    payment_method: string;
    id: string;
    student: {
      id: string;
      name: string;
    };
    course: {
      id: string;
      name: string;
      price?: number;
    };
  };
}

export interface CreatePaymentData {
  enrollment_id: string;
  amount: number;
  discount?: number;
  payment_method: string;
  payment_date: string;
  remarks?: string;
}

export interface UpdatePaymentData {
  amount?: number;
  payment_method?: string;
  payment_date?: string;
  remarks?: string;
}

export class PaymentsRepository {
  async getAll(): Promise<PaymentData[]> {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        enrollment:enrollments (
          id,
          student:students (id, name),
          course:courses (id, name, price)
        )
      `)
      .eq("deleted", false) // Only get non-deleted payments
      .order("payment_date", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    return data || [];
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from("payments")
      .update({ deleted: true })
      .eq("id", id);

    if (error) {
      console.error("Error deleting payment:", error);
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  async create(paymentData: CreatePaymentData): Promise<PaymentData> {
    const { data, error } = await supabase
      .from("payments")
      .insert([{
        enrollment_id: paymentData.enrollment_id,
        amount: paymentData.amount,
        discount: paymentData.discount || 0,
        payment_method: paymentData.payment_method,
        payment_date: paymentData.payment_date,
        remarks: paymentData.remarks || "",
        deleted: false
      }])
      .select(`
        *,
        enrollment:enrollments (
          id,
          student:students (id, name),
          course:courses (id, name, price)
        )
      `)
      .single();

    if (error) {
      console.error("Error creating payment:", error);
      throw new Error(`Failed to create payment: ${error.message}`);
    }

    return data;
  }

  async update(id: string, paymentData: UpdatePaymentData): Promise<PaymentData> {
    const { data, error } = await supabase
      .from("payments")
      .update(paymentData)
      .eq("id", id)
      .select(`
        *,
        enrollment:enrollments (
          id,
          student:students (id, name),
          course:courses (id, name, price)
        )
      `)
      .single();

    if (error) {
      console.error("Error updating payment:", error);
      throw new Error(`Failed to update payment: ${error.message}`);
    }

    return data;
  }

  async getById(id: string): Promise<PaymentData | null> {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        enrollment:enrollments (
          id,
          student:students (id, name),
          course:courses (id, name, price)
        )
      `)
      .eq("id", id)
      .eq("deleted", false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error("Error fetching payment by ID:", error);
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }

    return data;
  }
}