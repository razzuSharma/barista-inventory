import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { InventoryItem } from "@/types/inventory";

// Fetch all inventory items
export const useInventory = () => {
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(`Failed to fetch inventory: ${error.message}`);
      return data || [];
    },
  });
};

// Add new inventory item
export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryItem,
    unknown,
    { name: string; count_in_stock: number; category: string },
    { previousItems?: InventoryItem[] }
  >({
    mutationFn: async ({ name, count_in_stock, category }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .insert({
          name,
          count_in_stock,
          category,
          restock_needed: count_in_stock < 5,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to add item: ${error.message}`);
      return data as InventoryItem;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });
      const previousItems = queryClient.getQueryData<InventoryItem[]>([
        "inventory",
      ]);

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["inventory"], context.previousItems);
      }
    },
    onSuccess: (data) => {
      // Add the new item to the cache
      queryClient.setQueryData<InventoryItem[]>(["inventory"], (old = []) => [
        data,
        ...old,
      ]);
    },
  });
};

// Update stock count
export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { id: string; count_in_stock: number },
    unknown,
    { id: string; count_in_stock: number },
    { previousItems?: InventoryItem[] }
  >({
    mutationFn: async ({ id, count_in_stock }) => {
      const { error } = await supabase
        .from("inventory_items")
        .update({
          count_in_stock,
          restock_needed: count_in_stock < 5,
        })
        .eq("id", id);

      if (error) throw new Error(`Failed to update stock: ${error.message}`);
      return { id, count_in_stock };
    },
    onMutate: async ({ id, count_in_stock }) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });
      const previousItems = queryClient.getQueryData<InventoryItem[]>([
        "inventory",
      ]);

      queryClient.setQueryData<InventoryItem[]>(["inventory"], (old = []) =>
        old.map((item) =>
          item.id === id
            ? { ...item, count_in_stock, restock_needed: count_in_stock < 5 }
            : item
        )
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["inventory"], context.previousItems);
      }
    },
  });
};

// Toggle restock flag
export const useToggleRestock = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { id: string; restock_needed: boolean },
    unknown,
    { id: string; restock_needed: boolean },
    { previousItems?: InventoryItem[] }
  >({
    mutationFn: async ({ id, restock_needed }) => {
      const { error } = await supabase
        .from("inventory_items")
        .update({
          restock_needed,
        })
        .eq("id", id);

      if (error) throw new Error(`Failed to toggle restock: ${error.message}`);
      return { id, restock_needed };
    },
    onMutate: async ({ id, restock_needed }) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });
      const previousItems = queryClient.getQueryData<InventoryItem[]>([
        "inventory",
      ]);

      queryClient.setQueryData<InventoryItem[]>(["inventory"], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, restock_needed } : item))
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["inventory"], context.previousItems);
      }
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { id: string },
    unknown,
    { id: string },
    { previousItems?: InventoryItem[] }
  >({
    mutationFn: async ({ id }) => {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to delete item: ${error.message}`);
      }

      return { id };
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });
      const previousItems = queryClient.getQueryData<InventoryItem[]>([
        "inventory",
      ]);

      queryClient.setQueryData<InventoryItem[]>(["inventory"], (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["inventory"], context.previousItems);
      }
    },
  });
};

export const useEditInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    InventoryItem, // returned data
    unknown, // error
    { id: string; name: string; category: string }, // variables
    { previousItems?: InventoryItem[] } // context
  >({
    mutationFn: async ({ id, name, category }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .update({
          name,
          category,
        })
        .eq("id", id)
        .select("*") // return updated row
        .single(); // return single object instead of array

      if (error) {
        throw new Error(`Failed to update item: ${error.message}`);
      }
      return data as InventoryItem;
    },
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });

      const previousItems = queryClient.getQueryData<InventoryItem[]>([
        "inventory",
      ]);

      queryClient.setQueryData<InventoryItem[]>(["inventory"], (old = []) =>
        old.map((item) =>
          item.id === updatedItem.id
            ? {
                ...item,
                name: updatedItem.name,
                category: updatedItem.category,
              }
            : item
        )
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["inventory"], context.previousItems);
      }
    },
  });
};
