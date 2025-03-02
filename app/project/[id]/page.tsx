"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import TaskDialog from "@/components/task-dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectPage() {
  const { id } = useParams(); // Next.js 15 dynamic params
  const router = useRouter();

  const projects = useQuery(api.projects.getProjects);
  const project = projects?.find((p) => p._id === id);
  const tasks = useQuery(api.tasks.getTasks)?.filter((t) => t.projectId === id);

  const deleteProject = useMutation(api.projects.deleteProject);

  if (!project) return <p className="p-6">Loading project...</p>;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.name}
        </h1>
        <button
          className="text-red-500"
          onClick={() => {
            deleteProject({ projectId: id as Id<"projects"> });
            router.push("/"); // Redirect after deleting
          }}
        >
          Delete Project
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks?.map((task) => (
          <li
            key={task._id}
            className="p-4 border rounded-lg dark:border-gray-700"
          >
            <span>{task.name}</span>
          </li>
        ))}
      </ul>

      {/* Add Task (Automatically assigns projectId) */}
      <TaskDialog projectId={id as string} />
    </div>
  );
}
