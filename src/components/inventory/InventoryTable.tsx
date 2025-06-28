import React from "react";
import { Package, XCircle, AlertTriangle } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/inventory";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import StockActions from "./StockActions";
import StatusBadge from "./StatusBadge";
import EditInventoryItemDialog from "./EditInventoryItemDialog";
import { useDeleteInventoryItem } from "@/lib/queries/inventory";

type InventoryTableProps = {
  items: InventoryItem[];
  updateStock: UseMutationResult<
    { id: string; count_in_stock: number },
    unknown,
    { id: string; count_in_stock: number },
    { previousItems?: InventoryItem[] }
  >;
  toggleRestock: UseMutationResult<
    { id: string; restock_needed: boolean },
    unknown,
    { id: string; restock_needed: boolean },
    { previousItems?: InventoryItem[] }
  >;
};

const InventoryTable = ({
  items,
  updateStock,
  toggleRestock,
}: InventoryTableProps) => {
  const isUpdating = updateStock.isPending || toggleRestock.isPending;
  const deleteItem = useDeleteInventoryItem();
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No items found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Counts
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.category || "Uncategorized"}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      item.count_in_stock === 0
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : item.count_in_stock < 5
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "bg-green-50 text-green-600 border border-green-200"
                    }`}
                  >
                    {item.count_in_stock}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <StockActions
                    item={item}
                    updateStock={updateStock}
                    isUpdating={isUpdating}
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <StatusBadge item={item} toggleRestock={toggleRestock} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <EditInventoryItemDialog item={item} />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteItem.mutate({ id: item.id })}
                      disabled={deleteItem.isPending}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
