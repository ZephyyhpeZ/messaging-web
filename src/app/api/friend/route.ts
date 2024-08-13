import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { friendDataSelect, memberDataSelect } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: user.id }, { friendId: user.id }],
        status: "ACCEPTED",
      },
      select: friendDataSelect,
    });
    
    const formattedFriends = friends.map((friend) => {
      if (friend.userId === user.id) {
        return {
          id: friend.id,
          status: friend.status,
          userId: friend.userId,
          friendId: friend.friendId,
          user: friend.friend, 
        };
      } else if (friend.friendId === user.id) {
        return {
          id: friend.id,
          status: friend.status,
          userId: friend.userId,
          friendId: friend.friendId,
          user: friend.user,
        };
      }
      return null;
    });

    return Response.json(formattedFriends);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
