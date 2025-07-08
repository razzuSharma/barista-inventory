// lib/react-query/paymentsQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentsService } from "../services/paymentsService";
import {
  CreatePaymentData,
  UpdatePaymentData,
  PaymentData,
} from "@/lib/repositories/paymentRepository";

export const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...paymentsKeys.lists(), { filters }] as const,
  details: () => [...paymentsKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
} as const;

export const enrollmentsKeys = {
  all: ["enrollments"] as const,
  lists: () => [...enrollmentsKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...enrollmentsKeys.lists(), { filters }] as const,
  details: () => [...enrollmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...enrollmentsKeys.details(), id] as const,
} as const;

const paymentsService = new PaymentsService();

export const usePayments = () => {
  return useQuery({
    queryKey: paymentsKeys.lists(),
    queryFn: () => paymentsService.getAllPayments(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
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
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
};

// Mutations
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentData) =>
      paymentsService.createPayment(data),
    onMutate: async (newPayment) => {
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });

      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );

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
      if (context?.previousPayments) {
        queryClient.setQueryData(
          paymentsKeys.lists(),
          context.previousPayments
        );
      }
    },
    onSettled: () => {
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
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });
      await queryClient.cancelQueries({ queryKey: paymentsKeys.detail(id) });

      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );
      const previousPayment = queryClient.getQueryData<PaymentData>(
        paymentsKeys.detail(id)
      );

      if (previousPayments) {
        const updatedPayments = previousPayments.map((payment) =>
          payment.id === id ? { ...payment, ...data } : payment
        );
        queryClient.setQueryData<PaymentData[]>(
          paymentsKeys.lists(),
          updatedPayments
        );
      }

      if (previousPayment) {
        queryClient.setQueryData<PaymentData>(paymentsKeys.detail(id), {
          ...previousPayment,
          ...data,
        });
      }

      return { previousPayments, previousPayment };
    },
    onError: (err, { id }, context) => {
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
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() });

      const previousPayments = queryClient.getQueryData<PaymentData[]>(
        paymentsKeys.lists()
      );

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
      if (context?.previousPayments) {
        queryClient.setQueryData(
          paymentsKeys.lists(),
          context.previousPayments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() });
    },
  });
};

export const usePaymentTotals = () => {
  const { data: payments = [] } = usePayments();

  return useQuery({
    queryKey: [...paymentsKeys.lists(), "totals"],
    queryFn: () => paymentsService.calculateTotals(payments),
    enabled: payments.length > 0,
    staleTime: 1000 * 60 * 2,
  });
};
