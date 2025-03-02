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

export default function AddTaskDialog() {
  const createTask = useMutation(api.tasks.createTask);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleAddTask = () => {
    if (!taskName.trim()) return;

    createTask({ name: taskName, priority, tags });
    setTaskName("");
    setPriority(3);
    setTags([]);
    setOpen(false); // Close dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium transition">
          Add Task
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-black p-6 rounded-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Task</DialogTitle>
        </DialogHeader>

        {/* Task Name Input */}
        <input
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name..."
        />

        {/* Priority Selector */}
        <label className="block mt-3 text-sm">Priority</label>
        <select
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-transparent focus:outline-none"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
        >
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>

        {/* Tags Input */}
        <label className="block mt-3 text-sm">Tags</label>
        <input
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-transparent focus:outline-none"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
          placeholder="Comma-separated tags"
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
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
