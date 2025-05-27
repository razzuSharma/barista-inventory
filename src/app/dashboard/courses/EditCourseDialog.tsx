"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

export function EditCourseDialog({
  course,
  onUpdated,
}: {
  course: any;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState(course);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submits
    setIsSubmitting(true);

    try {
      const { id, ...rest } = form;
      const { error } = await supabase
        .from("courses")
        .update(rest)
        .eq("id", id);
      if (error) {
        console.error("Update error", error);
        return;
      }
      onUpdated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
          />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
