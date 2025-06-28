import React from "react";
import { AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/inventory";

type StatusBadgeProps = {
  item: InventoryItem;
  toggleRestock: UseMutationResult<
    { id: string; restock_needed: boolean },
    unknown,
    { id: string; restock_needed: boolean },
    { previousItems?: InventoryItem[] }
  >;
};

const StatusBadge = ({ item, toggleRestock }: StatusBadgeProps) => {
  const getStatusInfo = (item: InventoryItem) => {
    if (item.count_in_stock === 0) {
      return {
        status: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
      };
    } else if (item.count_in_stock < 5 || item.restock_needed) {
      return {
        status: item.restock_needed ? "Needs Restock" : "Low Stock",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        icon: AlertTriangle,
      };
    } else {
      return {
        status: "In Stock",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle,
      };
    }
  };

  const statusInfo = getStatusInfo(item);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}
      >
        <StatusIcon className="w-4 h-4" />
        {statusInfo.status}
      </div>

      {item.count_in_stock > 0 && (
        <button
          onClick={() =>
            toggleRestock.mutate({
              id: item.id,
              restock_needed: !item.restock_needed,
            })
          }
          className={`text-xs px-2 py-1 rounded transition-colors ${
            item.restock_needed
              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title={item.restock_needed ? "Mark as not needing restock" : "Mark as needing restock"}
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          {item.restock_needed ? "Remove Flag" : "Flag Restock"}
        </button>
      )}
    </div>
  );
};

export default StatusBadge;
