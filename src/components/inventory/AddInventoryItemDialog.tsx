"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useAddInventoryItem } from "@/lib/queries/inventory";

export default function AddInventoryItemDialog() {
  const [name, setName] = useState("");
  const [count, setCount] = useState<number>(0);
  const [category, setCategory] = useState("");

  const addItem = useAddInventoryItem();

  const handleAddItem = () => {
    addItem.mutate(
      { name, count_in_stock: count, category },
      {
        onSuccess: () => {
          setName("");
          setCount(0);
          setCategory("");
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Item Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coffee Beans"
            />
          </div>
          <div className="space-y-3">
            <Label>Stock Count</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-3">
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Food"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddItem}
            disabled={!name || count < 0 || addItem.isPending}
          >
            {addItem.isPending ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
