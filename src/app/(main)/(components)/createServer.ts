"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { serverSchema, ServerValue } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function createServer(serverValue: ServerValue) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "User not authenticated." };
    }
    const { name, description } = serverSchema.parse(serverValue);

    const serverId = generateIdFromEntropySize(10);

    const member = {
      id: generateIdFromEntropySize(10),
      userId: user.id,
    };

    const newServer = await prisma.server.create({
      data: {
        id: serverId,
        name,
        description,
        ownerId: user.id,
        ServerMember: {
          create: [
            {
              id: member.id,
              userId: member.userId,
              role: "OWNER",
              status:"ACCEPTED",
              joinedAt: new Date(),
            },
          ],
        },
      },
    });

    return { newServer };
  } catch (error) {
    console.log(isRedirectError(error));

    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong.",
    };
  }
}
