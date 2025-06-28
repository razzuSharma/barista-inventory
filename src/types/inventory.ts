export type InventoryItem = {
    id: string;
    name: string;
    count_in_stock: number;
    restock_needed: boolean;
    category?: string;
    created_at: string;
  };
  