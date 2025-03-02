"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddProjectDialog() {
  const createProject = useMutation(api.projects.createProject);
  const [projectName, setProjectName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddProject = () => {
    if (!projectName.trim()) return;

    createProject({ name: projectName });
    setProjectName("");
    setOpen(false); // Close dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium transition">
          Add Project
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-black p-6 rounded-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            New Project
          </DialogTitle>
        </DialogHeader>

        {/* Project Name Input */}
        <input
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name..."
        />

        <DialogFooter className="flex justify-end mt-4">
          <button
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-black dark:text-white transition"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium transition"
            onClick={handleAddProject}
          >
            Add Project
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
