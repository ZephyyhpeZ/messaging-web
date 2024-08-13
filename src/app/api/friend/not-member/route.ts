import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  formatedFriendData,
  friendDataSelect,
  memberDataSelect,
} from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: user.id }, { friendId: user.id }],
        status: "ACCEPTED",
      },
      select: friendDataSelect,
    });

    const serverMembers = await prisma.serverMember.findMany({
      where: {
        serverId: id,
      },
      select: {
        userId: true,
      },
    });
    const formattedFriends = friends
      .map((friend) => {
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
      })
      .filter(Boolean);

    const serverMemberIds = serverMembers.map((member) => member.userId);

    const validFormattedFriends = formattedFriends.filter(
      (formatedFriend) =>
        formatedFriend !== null && formatedFriend !== undefined,
    );

    const friendsNotInServer = validFormattedFriends.filter(
      (formatedFriend) => !serverMemberIds.includes(formatedFriend.user.id),
    );
    

    return Response.json(friendsNotInServer);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
