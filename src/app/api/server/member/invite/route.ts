import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { friendDataSelect, memberDataSelect } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }


    const invites = await prisma.serverMember.findMany({
      where: { userId: user.id, status: "PENDING" },
      select: memberDataSelect,
    });

    return Response.json(invites);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
