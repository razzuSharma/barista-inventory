import React from "react";
import { XCircle } from "lucide-react";

type ErrorMessageProps = {
  error: Error;
};

const ErrorMessage = ({ error }: ErrorMessageProps) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
    <div className="flex items-center gap-3">
      <XCircle className="w-6 h-6 text-red-600" />
      <div>
        <h3 className="text-red-800 font-medium">Error loading inventory</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    </div>
  </div>
);

export default ErrorMessage;
