"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserData } from "../updateUserData";

export async function HandleFriendRequest(id:string, status:string) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated." };
  }

  if (status === "ACCEPT") {
    await prisma.friend.update({
      where: {
        id,
      },
      data: {
        status: "ACCEPTED",
      },
    });
  } else {
    await prisma.friend.delete({
      where: {
        id,
      }
    });
  }
  updateUserData();
}
