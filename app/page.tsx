"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel"; // Import Convex ID type
import AddTaskDialog from "@/components/add-task-dialog";

interface Task {
  _id: Id<"tasks">;
  name: string;
  completed: boolean;
  priority?: number;
  tags?: string[];
}

export default function Home() {
  const tasks = useQuery(api.tasks.getTasks);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [taskName, setTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Id<"tasks"> | null>(null);
  const [updatedTaskName, setUpdatedTaskName] = useState("");
  const [updatedPriority, setUpdatedPriority] = useState(3);

  const handleEditTask = (task: Task) => {
    setEditingTask(task._id);
    setUpdatedTaskName(task.name);
    setUpdatedPriority(task.priority ?? 3);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    updateTask({
      taskId: editingTask as Id<"tasks">, // Explicitly cast ID
      name: updatedTaskName,
      priority: updatedPriority,
    });

    setEditingTask(null);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">My Tasks</h1>
        <AddTaskDialog />
      </div>

      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li
            key={task._id}
            className="p-2 border rounded flex justify-between items-center"
          >
            {editingTask === task._id ? (
              <div className="flex space-x-2">
                <input
                  className="border p-1"
                  value={updatedTaskName}
                  onChange={(e) => setUpdatedTaskName(e.target.value)}
                />
                <select
                  className="border p-1"
                  value={updatedPriority}
                  onChange={(e) => setUpdatedPriority(parseInt(e.target.value))}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </select>
                <button
                  className="bg-green-500 text-white px-2 py-1"
                  onClick={() => handleSaveTask()}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    updateTask({ taskId: task._id, completed: !task.completed })
                  }
                />
                <span
                  className={task.completed ? "line-through text-gray-500" : ""}
                >
                  {task.name} (Priority: {task.priority ?? 3})
                </span>
                <button
                  className="text-blue-500"
                  onClick={() => handleEditTask(task)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteTask({ taskId: task._id })}
                >
                  ❌
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
