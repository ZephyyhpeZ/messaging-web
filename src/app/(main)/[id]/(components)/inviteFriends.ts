"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function inviteFriends(friends: string[], serverId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "User not authenticated." };
    }

    await prisma.serverMember.createMany({
      data: friends.map((friendId) => ({
        userId: friendId,
        serverId: serverId,
        role: "MEMBER",
      })),
    });

    // return { newServer };
  } catch (error) {
    return {
      error: "Something went wrong.",
    };
  }
}
