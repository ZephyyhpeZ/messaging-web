"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserData } from "../updateUserData";

export async function handleServerInvites(id: string, status: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated." };
  }

  if (status === "ACCEPT") {
    await prisma.serverMember.update({
      where: {
        id,
      },
      data: {
        status: "ACCEPTED",
        joinedAt: new Date(),
      },
    });
  } else {
    await prisma.serverMember.delete({
      where: {
        id,
      },
    });
  }
}

export async function handleServerLeave(serverId: string, userId: string) {
  console.log("runned");

  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated." };
  }
  console.log("select");

  const selectedMember = await prisma.serverMember.findFirst({
    where: {
      serverId,
      userId,
    },
  });

  if (!selectedMember) {
    return { error: "User not authenticated." };
  }

  await prisma.serverMember.delete({
    where: {
      id: selectedMember.id,
    },
  });
  console.log("leave");
}
