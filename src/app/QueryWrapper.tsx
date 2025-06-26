"use client";
import { queryClient } from "@/lib/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryWrapper;
