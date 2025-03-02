import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    name: v.string(),
    priority: v.optional(v.number()), // Optional priority
    tags: v.optional(v.array(v.string())), // Optional tags
  },
  handler: async ({ db, auth }, { name, priority, tags }) => {
    const user = await auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    return await db.insert("tasks", {
      userId: user.subject,
      name,
      completed: false,
      priority: priority ?? 3, // Default priority: Medium
      tags: tags ?? [],
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
    },
    handler: async ({ db, auth }, { taskId, name, completed, priority, tags }) => {
      const user = await auth.getUserIdentity();
      if (!user) throw new Error("Unauthorized");
  
      // Create an update object that only includes provided fields
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (completed !== undefined) updateData.completed = completed;
      if (priority !== undefined) updateData.priority = priority;
      if (tags !== undefined) updateData.tags = tags;
  
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