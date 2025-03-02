import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
    args: {
      name: v.string(),
      priority: v.optional(v.number()), // Default to 3 if undefined
      dueDate: v.optional(v.number()), // Store due date as a timestamp
      tags: v.optional(v.array(v.string())),
      projectId: v.optional(v.id("projects")),
    },
    handler: async ({ db, auth }, { name, priority, dueDate, tags, projectId }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      return await db.insert("tasks", {
        userId: user.subject,
        name,
        completed: false,
        priority: priority ?? 3, // Default priority is 3
        dueDate: dueDate ?? undefined, // Default is no due date
        tags: tags ?? [],
        projectId,
        createdAt: Date.now(),
      });
    },
  });
  

export const updateTask = mutation({
    args: {
      taskId: v.id("tasks"),
      name: v.optional(v.string()),
      completed: v.optional(v.boolean()),
      priority: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      dueDate: v.optional(v.number()),
    },
    handler: async ({ db, auth }, { taskId, name, completed, priority, tags, dueDate }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      // Create an update object that only includes provided fields
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (completed !== undefined) updateData.completed = completed;
      if (priority !== undefined) updateData.priority = priority;
      if (tags !== undefined) updateData.tags = tags;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
  
      await db.patch(taskId, updateData);
    },
  });
  
export const deleteTask = mutation({
    args: {
      taskId: v.id("tasks"),
    },
    handler: async ({ db, auth }, { taskId }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      await db.delete(taskId);
    },
  });
  

export const getTasks = query(async ({ db, auth }) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
  
    return await db.query("tasks").withIndex("by_user", q => q.eq("userId", user.subject)).order("desc").collect();
  });

  // Get the 5 most recently created tasks
  export const getRecentTasks = query({
    handler: async ({ db, auth }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      return await db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", user.subject))
        .order("desc") // Sort by most recent
        .take(5);
    },
  });
  
  // Get the 5 most important tasks (by priority & due date)
  export const getUpcomingTasks = query({
    handler: async ({ db, auth }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      return await db
        .query("tasks")
        .withIndex("by_user_dueDate_priority", (q) => q.eq("userId", user.subject))
        .order("asc") // Order by due date first, then priority
        .take(5);
    },
  });
  
  