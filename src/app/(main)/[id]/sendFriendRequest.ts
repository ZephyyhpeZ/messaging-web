"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { friendDataSelect, messageDataSelect } from "@/lib/types";

export async function SendFriendRequest(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated." };
  }
  const name = formData.get("name") as string;
  const tag = formData.get("tag") as string;

  const isExist = await prisma.user.findFirst({
    where:{
        discriminator: tag,
        displayName: name,
        NOT:{
          id:user.id
        }
    },
    select:{
      id: true
    }
  })
  if (!isExist) {
    return { error: "User doesn't exist" };
  }

  const isRequestExist = await prisma.friend.findFirst({
    where: {
      OR: [
        { userId: user.id, friendId: isExist.id },
        { userId: isExist.id, friendId: user.id },
      ],
    },
    select: {
      id: true,
    },
  });
  console.log(isRequestExist);
  
  if (isRequestExist) {
    return { error: "Request already been sent" };
  }

  await prisma.friend
    .create({
      data: { userId: user.id, friendId: isExist.id, status: "PENDING"},
      select: friendDataSelect,
    })
    
}
 