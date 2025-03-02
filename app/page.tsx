"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import TaskDialog from "@/components/task-dialog";
import AddProjectDialog from "@/components/add-project-dialog";

export default function Home() {
  return (
    <div className="flex flex-col max-w-4xl mx-auto p-8 space-y-2">
      {/* Landing Page for Logged-Out Users */}
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen space-y-6 text-center">
          <h1 className="text-4xl font-bold">Welcome to Task Wise</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Organize your projects and tasks efficiently.
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-md transition duration-200 hover:opacity-90 dark:hover:opacity-90">
              Get Started
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Dashboard for Logged-In Users */}
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}

// Dashboard Component (Visible only when signed in)
function Dashboard() {
  const recentTasks = useQuery(api.tasks.getRecentTasks);
  const upcomingTasks = useQuery(api.tasks.getUpcomingTasks);
  const latestProjects = useQuery(api.projects.getLatestProjects);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

      {/* Recent Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Tasks</h2>
        <ul className="space-y-3">
          {recentTasks?.map((task) => (
            <TaskDialog
              key={task._id}
              task={task}
              trigger={
                <li className="flex justify-between p-3 border rounded-lg dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                  <span>{task.name}</span>
                  {task.projectId && (
                    <Link
                      href={`/project/${task.projectId}`}
                      className="text-blue-500 text-sm"
                    >
                      View Project
                    </Link>
                  )}
                </li>
              }
            />
          ))}
        </ul>
        <div className="mt-3">
          <TaskDialog /> {/* Add Task Button */}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Upcoming Tasks</h2>
        <ul className="space-y-3">
          {upcomingTasks?.map((task) => (
            <TaskDialog
              key={task._id}
              task={task}
              trigger={
                <li className="flex justify-between p-3 border rounded-lg dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                  <span>
                    {task.name} -{" "}
                    <span className="text-gray-500">
                      Priority: {task.priority}
                    </span>
                  </span>
                  {task.projectId && (
                    <Link
                      href={`/project/${task.projectId}`}
                      className="text-blue-500 text-sm"
                    >
                      View Project
                    </Link>
                  )}
                </li>
              }
            />
          ))}
        </ul>
      </section>

      {/* Latest Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Latest Projects</h2>
        <ul className="space-y-3">
          {latestProjects?.map((project) => (
            <li
              key={project._id}
              className="p-3 border rounded-lg dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              <Link
                href={`/project/${project._id}`}
                className="text-lg font-semibold block"
              >
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <AddProjectDialog />
        </div>
      </section>
    </>
  );
}
