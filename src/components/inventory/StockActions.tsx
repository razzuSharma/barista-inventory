import React, { useState } from "react";
import { Plus, Minus, Check, X } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/inventory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.count_in_stock.toString());

  const handleSave = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      updateStock.mutate({
        id: item.id,
        count_in_stock: newValue,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.count_in_stock.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

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

      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-16 h-8 text-center text-sm"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
          >
            <Check className="w-3 h-3 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      ) : (
        <span 
          className="min-w-[3rem] text-center font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          onClick={() => setIsEditing(true)}
          title="Click to edit manually"
        >
          {item.count_in_stock}
        </span>
      )}

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
