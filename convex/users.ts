import { mutation } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    console.log(identity);

    // Check if we've already stored this identity before.
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("byClerkUserId", (q) =>
    //     q.eq("clerkUserId", identity.tokenIdentifier),
    //   )
    //   .unique();

    // if (user !== null) {
    //   // If we've seen this identity before but the name has changed, patch the value.
    //   if (user.name !== identity.name) {
    //     await ctx.db.patch(user._id, { name: identity.name });
    //   }
    //   return user._id;
    // }

    // If it's a new identity, create a new `User`.
    // return await ctx.db.insert("users", {
    //   name: identity.name ?? "Anonymous",
    //   tokenIdentifier: identity.tokenIdentifier,
    // });
  },
});