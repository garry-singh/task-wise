import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),
        email: v.string(),
        name: v.string(),
        lastLoginAt: v.number(),
        username: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
      .index("by_clerk_user_id", ["clerkUserId"])
      .index("by_last_login", ["lastLoginAt"]),
    tasks: defineTable({
        userId: v.string(),
        name: v.string(),
        completed: v.boolean(),
        priority: v.number(), // Always defined (1-5)
        dueDate: v.optional(v.number()), // Store due date as a timestamp
        tags: v.optional(v.array(v.string())),
        createdAt: v.number(),
        projectId: v.optional(v.id("projects")), // Tasks can belong to a project
      })
      .index("by_user", ["userId"])
      .index("by_project_id", ["projectId"])
      .index("by_user_dueDate_priority", ["userId", "dueDate", "priority"]),
    projects: defineTable({
        userId: v.string(),
        name: v.string(),
        createdAt: v.number(),
      })
      .index("by_user", ["userId"]),
});