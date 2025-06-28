import React from "react";
import { RefreshCw } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex items-center gap-3">
      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      <span className="text-gray-600">Loading inventory...</span>
    </div>
  </div>
);

export default LoadingSpinner;
