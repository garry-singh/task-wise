"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function SyncUserWithConvex() {
  const { user } = useUser();
  const updateOrCreateUser = useMutation(api.users.updateOrCreateUser);

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      try {
        await updateOrCreateUser({
          clerkUserId: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? "",
          lastLoginAt: Date.now(),
          username: user.username ?? "",
        });
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    };

    syncUser();
  }, [user, updateOrCreateUser]);

  return null;
}
