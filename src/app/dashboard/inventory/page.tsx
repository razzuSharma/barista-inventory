"use client";

import React, { useState } from "react";
import { Package, AlertTriangle, XCircle } from "lucide-react";

import {
  useInventory,
  useUpdateStock,
  useToggleRestock,
} from "@/lib/queries/inventory";

import StatsCard from "@/components/inventory/StatsCard";
import SearchAndFilter from "@/components/inventory/SearchAndFilter";
import InventoryTable from "@/components/inventory/InventoryTable";
import LoadingSpinner from "@/components/inventory/LoadingSpinner";
import ErrorMessage from "@/components/inventory/ErrorMessage";
import AddInventoryItemDialog from "@/components/inventory/AddInventoryItemDialog";
const InventoryPage = () => {
  const { data: items, isLoading, error } = useInventory();
  const updateStock = useUpdateStock();
  const toggleRestock = useToggleRestock();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Derive filtered list
  const filteredItems = React.useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category &&
          item.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        filterCategory === "all" || item.category === filterCategory;

      let matchesStatus = true;
      switch (filterStatus) {
        case "in-stock":
          matchesStatus = item.count_in_stock >= 5;
          break;
        case "low-stock":
          matchesStatus = item.count_in_stock > 0 && item.count_in_stock < 5;
          break;
        case "out-of-stock":
          matchesStatus = item.count_in_stock === 0;
          break;
        case "needs-restock":
          matchesStatus = item.restock_needed;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchTerm, filterStatus, filterCategory]);

  // Calculate stats
  const totalItems = items?.length ?? 0;
  const outOfStock = items?.filter((i) => i.count_in_stock === 0).length ?? 0;
  const needsRestock = items?.filter((i) => i.restock_needed).length ?? 0;

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!items) return [];
    return Array.from(
      new Set(items.map((i) => i.category).filter(Boolean))
    ) as string[];
  }, [items]);

  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-10 px-6 pb-6 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard title="Total Items" value={totalItems} icon={Package} />
        <StatsCard
          title="Out of Stock"
          value={outOfStock}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="Needs Restock"
          value={needsRestock}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
      <AddInventoryItemDialog />
      <InventoryTable
        items={filteredItems}
        updateStock={updateStock}
        toggleRestock={toggleRestock}
      />
    </div>
  );
};

export default InventoryPage;
