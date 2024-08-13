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
      where: { friendId: user.id, status: "PENDING" },
      select: friendDataSelect,
    });

    return Response.json(friends);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
