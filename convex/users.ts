import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateOrCreateUser = mutation({
  args: {
    clerkUserId: v.string(),
    name: v.string(),
    email: v.string(),
    lastLoginAt: v.number(),
    username: v.string()
  },
  handler: async (ctx, { clerkUserId, name, email, lastLoginAt, username }) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        clerkUserId,
        name,
        email,
        lastLoginAt,
        username,
      });
      return existingUser._id;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      clerkUserId,
      name,
      email,
      lastLoginAt,
      username,
    });

    return newUserId;
  },
});

export const getUserById = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    return user;
  },
});