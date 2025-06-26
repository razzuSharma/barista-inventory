// lib/react-query/paymentsQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentsService } from "../services/paymentsService";
import {
  CreatePaymentData,
  UpdatePaymentData,
  PaymentData,
} from "@/lib/repositories/paymentRepository";
import { EnrollmentData } from "@/lib/repositories/enrollmentsRepository";

// Query Keys
export const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...paymentsKeys.lists(), { filters }] as const,
  details: () => [...paymentsKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
} as const;

export const enrollmentsKeys = {
  all: ["enrollments"] as const,
  lists: () => [...enrollmentsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...enrollmentsKeys.lists(), { filters }] as const,
  details: () => [...enrollmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...enrollmentsKeys.details(), id] as const,
} as const;

const paymentsService = new PaymentsService();

// Queries
export const usePayments = () => {
  return useQuery({
    queryKey: paymentsKeys.lists(),
    queryFn: () => paymentsService.getAllPayments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: paymentsKeys.detail(id),
    queryFn: () => paymentsService.getPaymentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEnrollments = () => {
  return useQuery({
    queryKey: enrollmentsKeys.lists(),
    queryFn: () => paymentsService.getAllEnrollments(),
    staleTime: 1000 * 60 * 10, // 10 minutes (enrollments change less frequently)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

// Mutations
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentData) =>
      paymentsService.createPayment(data),
    onMutate: async (newPayment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });

      // Snapshot the previous value
      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );

      // Optimistically update to the new value
      if (previousPayments) {
        const optimisticPayment: PaymentData = {
          id: `temp-${Date.now()}`,
          amount: newPayment.amount,
          payment_date: newPayment.payment_date,
          remarks: newPayment.remarks || "",
          deleted: false,
          enrollment: {
            id: newPayment.enrollment_id,
            payment_method: newPayment.payment_method,
            student: { id: "", name: "Loading..." },
            course: { id: "", name: "Loading..." },
          },
        };

        queryClient.setQueryData<PaymentData[]>(paymentsKeys.lists(), [
          ...previousPayments,
          optimisticPayment,
        ]);
      }

      return { previousPayments };
    },
    onError: (err, newPayment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPayments) {
        queryClient.setQueryData(
          paymentsKeys.lists(),
          context.previousPayments
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentData }) =>
      paymentsService.updatePayment(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });
      await queryClient.cancelQueries({ queryKey: paymentsKeys.detail(id) });

      // Snapshot the previous values
      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );
      const previousPayment = queryClient.getQueryData<PaymentData>(
        paymentsKeys.detail(id)
      );

      // Optimistically update the payments list
      if (previousPayments) {
        const updatedPayments = previousPayments.map((payment) =>
          payment.id === id ? { ...payment, ...data } : payment
        );
        queryClient.setQueryData<PaymentData[]>(
          paymentsKeys.lists(),
          updatedPayments
        );
      }

      // Optimistically update the individual payment
      if (previousPayment) {
        queryClient.setQueryData<PaymentData>(paymentsKeys.detail(id), {
          ...previousPayment,
          ...data,
        });
      }

      return { previousPayments, previousPayment };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPayments) {
        queryClient.setQueryData(
          paymentsKeys.lists(),
          context.previousPayments
        );
      }
      if (context?.previousPayment) {
        queryClient.setQueryData(
          paymentsKeys.detail(id),
          context.previousPayment
        );
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentsKeys.detail(id) });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsService.deletePayment(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });

      // Snapshot the previous value
      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );

      // Optimistically remove the payment
      if (previousPayments) {
        const updatedPayments = previousPayments.filter(
          (payment) => payment.id !== id
        );
        queryClient.setQueryData<PaymentData[]>(
          paymentsKeys.lists(),
          updatedPayments
        );
      }

      return { previousPayments };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousPayments) {
        queryClient.setQueryData(
          paymentsKeys.lists(),
          context.previousPayments
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() });
    },
  });
};

// Custom hook for payment totals with memoization
export const usePaymentTotals = () => {
  const { data: payments = [] } = usePayments();

  return useQuery({
    queryKey: [...paymentsKeys.lists(), "totals"],
    queryFn: () => paymentsService.calculateTotals(payments),
    enabled: payments.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
