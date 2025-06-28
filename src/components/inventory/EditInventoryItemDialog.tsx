"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import { useEditInventoryItem } from "@/lib/queries/inventory";

type Props = {
  item: InventoryItem;
};

export default function EditInventoryItemDialog({ item }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category || "");

  const editItem = useEditInventoryItem();

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setName(item.name);
      setCategory(item.category || "");
    }
  };

  const handleSave = () => {
    editItem.mutate(
      { id: item.id, name, category },
      {
        onSuccess: () => {
          setOpen(false); // close dialog
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="ml-2">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coffee Beans"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Food"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name || editItem.isPending}>
            {editItem.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
