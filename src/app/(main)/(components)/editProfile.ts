"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  profileSchema,
  ProfileValue,
  serverSchema,
  ServerValue,
} from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { updateSession } from "./updateSession";

export async function editProfile(profileValue: ProfileValue) {
  try {
    let { session, user } = await validateRequest();

    if (!user) {
      return { error: "User not authenticated." };
    }

    if (!session) {
      return { error: "User not authenticated." };
    }
    const { displayName, username, discriminator } =
      profileSchema.parse(profileValue);

    const isExistUsername = await prisma.user.findFirst({
      where: {
        username,
        id: {
          not: user.id,
        },
      },
    });

    if (isExistUsername) {
      return { error: "Username already exist" };
    }

    const isExistDiscriminator = await prisma.user.findFirst({
      where: {
        discriminator,
        id: {
          not: user.id,
        },
      },
    });

    if (isExistDiscriminator) {
      return { error: "tag already exist" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName,
        username,
        discriminator,
      },
    });

    updateSession()

    return { updatedUser };
  } catch (error) {
    return {
      error: "Something went wrong.",
    };
  }
}
