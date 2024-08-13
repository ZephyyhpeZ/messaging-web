"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { serverSchema, ServerValue } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function editServer(serverValue: ServerValue, serverId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "User not authenticated." };
    }

    const { name, description } = serverSchema.parse(serverValue);

    const existingServer = await prisma.server.findUnique({
      where: { id: serverId },
      include: { ServerMember: true },
    });

    if (!existingServer) {
      return { error: "Server not found." };
    }

    // Check if the user is the owner of the server
    if (existingServer.ownerId !== user.id) {
      return { error: "You do not have permission to update this server." };
    }

    // Update the server's details
    const updatedServer = await prisma.server.update({
      where: { id: serverId },
      data: {
        name,
        description,
      },
    });

    return { updatedServer };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the server." };
  }
}
