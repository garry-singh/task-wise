"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface TaskDialogProps {
  task?: {
    _id: string;
    name: string;
    priority: number;
    dueDate?: number;
    tags?: string[];
    projectId?: string;
  };
  projectId?: string;
  trigger?: React.ReactNode; // Allows any button to open the dialog
}

export default function TaskDialog({
  task,
  projectId,
  trigger,
}: TaskDialogProps) {
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [taskName, setTaskName] = React.useState(task?.name || "");
  const [priority, setPriority] = React.useState(task?.priority ?? 3);
  const [tags, setTags] = React.useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [open, setOpen] = React.useState(false);

  const handleSaveTask = () => {
    if (!taskName.trim()) return;

    if (task) {
      updateTask({
        taskId: task._id as Id<"tasks">,
        name: taskName,
        priority,
        dueDate: dueDate ? dueDate.getTime() : undefined,
        tags,
      });
    } else {
      createTask({
        name: taskName,
        priority,
        dueDate: dueDate ? dueDate.getTime() : undefined,
        tags,
        projectId: projectId ? (projectId as Id<"projects">) : undefined,
      });
    }

    setOpen(false);
  };

  const handleDeleteTask = () => {
    if (task) {
      deleteTask({ taskId: task._id as Id<"tasks"> });
      setOpen(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput(""); // Clear input
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="default">Add Task</Button>}
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-black p-6 rounded-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {task ? "Edit Task" : "New Task"}
          </DialogTitle>
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
          <option value={4}>Urgent</option>
          <option value={5}>Critical</option>
        </select>

        {/* Due Date Picker */}
        <label className="block mt-3 text-sm">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Tags Input */}
        <label className="block mt-3 text-sm">Tags</label>
        <input
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-transparent focus:outline-none"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type and press Enter to add tags"
        />

        {/* Display Added Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <DialogFooter className="flex justify-between mt-4">
          {task && (
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete Task
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSaveTask}>
              {task ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
