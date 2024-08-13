"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function updateSession() {
  try {
    let { session, user } = await validateRequest();

    if (!user) {
      return { error: "User not authenticated." };
    }

    if (!session) {
      return { error: "User not authenticated." };
    }

    const newUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        discriminator: true,
        username: true,
        displayName: true,
        googleId: true,
        email: true,
      },
    }); 
    if(!newUser){
      return { error: "User not authenticated." };

    }
    user.username = newUser?.username;
    user.displayName = newUser.displayName;
    user.discriminator = newUser.discriminator;
    await lucia.invalidateSession(session.id);
    const newSession = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(newSession.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

  } catch (error) {
    return {
      error: "Something went wrong.",
    };
  }
}
