import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new project
export const createProject = mutation({
  args: { name: v.string() },
  handler: async ({ db, auth }, { name }) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    return await db.insert("projects", {
      userId: user.subject,
      name,
      createdAt: Date.now(),
    });
  },
});

// Get all projects for the logged-in user
export const getProjects = query({
  handler: async ({ db, auth }) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    return await db.query("projects").withIndex("by_user", (q) => q.eq("userId", user.subject)).collect();
  },
});

// Delete a project (and optionally its tasks)
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async ({ db, auth }, { projectId }) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    // Delete tasks under this project first
    const tasks = await db.query("tasks").withIndex("by_project_id", (q) => q.eq("projectId", projectId)).collect();
    for (const task of tasks) {
      await db.delete(task._id);
    }

    // Now delete the project
    await db.delete(projectId);
  },
});

// Get the 5 most recently created projects
export const getLatestProjects = query({
    handler: async ({ db, auth }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      return await db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", user.subject))
        .order("desc") // Sort by most recent
        .take(5);
    },
  });
  