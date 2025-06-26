// lib/services/paymentsService.ts
import { PaymentsRepository, PaymentData, CreatePaymentData, UpdatePaymentData } from "@/lib/repositories/paymentRepository";
import { EnrollmentsRepository, EnrollmentData } from "../repositories/enrollmentsRepository";

export interface PaymentTotals {
  totalReceived: number;
  fullyPaidCount: number;
  totalDue: number;
}

export class PaymentsService {
  private paymentsRepository: PaymentsRepository;
  private enrollmentsRepository: EnrollmentsRepository;

  constructor() {
    this.paymentsRepository = new PaymentsRepository();
    this.enrollmentsRepository = new EnrollmentsRepository();
  }

  async getAllPayments(): Promise<PaymentData[]> {
    return await this.paymentsRepository.getAll();
  }

  async getAllEnrollments(): Promise<EnrollmentData[]> {
    return await this.enrollmentsRepository.getAll();
  }

  async deletePayment(id: string): Promise<void> {
    return await this.paymentsRepository.softDelete(id);
  }

  async createPayment(paymentData: CreatePaymentData): Promise<PaymentData> {
    // Validate enrollment exists
    const enrollment = await this.enrollmentsRepository.getById(paymentData.enrollment_id);
    if (!enrollment) {
      throw new Error("Selected enrollment does not exist");
    }

    // Validate amount
    if (paymentData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return await this.paymentsRepository.create(paymentData);
  }

  async updatePayment(id: string, paymentData: UpdatePaymentData): Promise<PaymentData> {
    // Validate amount if provided
    if (paymentData.amount !== undefined && paymentData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return await this.paymentsRepository.update(id, paymentData);
  }

  async getPaymentById(id: string): Promise<PaymentData | null> {
    return await this.paymentsRepository.getById(id);
  }

  calculateTotals(payments: PaymentData[]): PaymentTotals {
    const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const enrollmentPayments = new Map<string, number>();
    const fullPayments = new Set<string>();

    // Calculate payments per enrollment
    for (const payment of payments) {
      const enrollmentId = payment.enrollment.id;
      const coursePrice = payment.enrollment.course?.price || 0;
      const previousAmount = enrollmentPayments.get(enrollmentId) || 0;
      const totalPaid = previousAmount + payment.amount;
      
      enrollmentPayments.set(enrollmentId, totalPaid);
      
      if (totalPaid >= coursePrice) {
        fullPayments.add(enrollmentId);
      }
    }

    // Calculate total due
    const totalDue = [...enrollmentPayments.entries()].reduce((accumulator, [enrollmentId, paidAmount]) => {
      const coursePrice = payments.find(p => p.enrollment.id === enrollmentId)?.enrollment.course?.price || 0;
      return accumulator + Math.max(0, coursePrice - paidAmount);
    }, 0);

    return {
      totalReceived,
      fullyPaidCount: fullPayments.size,
      totalDue
    };
  }
}