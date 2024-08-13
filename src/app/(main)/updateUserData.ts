"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { friendDataSelect } from "@/lib/types";

// export async function updateStatus(status: string) {
//   const { user } = await validateRequest();
//   if (!user) {
//     return { error: "User not authenticated." };
//   }
//   const userId = user.id;
//   await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       status: status as Status,
//     }
//   });
  
//   updateUserData()
// }

export async function updateUserData() {
  const Pusher = require("pusher");
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap1",
    useTLS: true,
  });
  const { user } = await validateRequest();

  if (!user) {
    return { error: "User not authenticated." };
  }

  const userId = user.id;

  await prisma.user
    .findUnique({
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
    })
    .then((friend) => {
      pusher.trigger(`presence${userId}`, "update", friend);
    });
}
