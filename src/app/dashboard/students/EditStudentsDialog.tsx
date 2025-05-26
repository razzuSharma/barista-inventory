"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/supabase";

const EditStudentsDialog = ({
  student,
  onUpdated,
}: {
  student: any;
  onUpdated: () => void;
}) => {
  const [form, setForm] = useState(student);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...rest } = form;
    const { error } = await supabase.from("students").update(rest).eq("id", id);
    if (error) return console.error("Update error", error);
    onUpdated();
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
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Student Email"
            required
          />
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Student Address"
            required
          />
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Student Phone"
            required
          />

          <Select
            value={form.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger className="w-full rounded-md border border-input px-3 py-2 text-sm">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.shift}
            onValueChange={(value) => handleSelectChange("shift", value)}
          >
            <SelectTrigger className="w-full rounded-md border border-input px-3 py-2 text-sm">
              <SelectValue placeholder="Select Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8:30 to 10:00">8:30 to 10:00</SelectItem>
              <SelectItem value="11:00 to 12:30">11:00 to 12:30</SelectItem>
              <SelectItem value="12:30 to 2:00">12:30 to 2:00</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentsDialog;
