import React from "react";
import { Plus, Minus } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/inventory";

type StockActionsProps = {
  item: InventoryItem;
  updateStock: UseMutationResult<
    { id: string; count_in_stock: number },
    unknown,
    { id: string; count_in_stock: number },
    { previousItems?: InventoryItem[] }
  >;
  isUpdating: boolean;
};

const StockActions = ({ item, updateStock, isUpdating }: StockActionsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() =>
          updateStock.mutate({
            id: item.id,
            count_in_stock: Math.max(item.count_in_stock - 1, 0),
          })
        }
        disabled={isUpdating || item.count_in_stock === 0}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4 text-gray-600" />
      </button>

      <span className="min-w-[3rem] text-center font-medium">
        {item.count_in_stock}
      </span>

      <button
        onClick={() =>
          updateStock.mutate({
            id: item.id,
            count_in_stock: item.count_in_stock + 1,
          })
        }
        disabled={isUpdating}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default StockActions;
