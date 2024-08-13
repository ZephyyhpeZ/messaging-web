import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { memberDataSelect } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }
    if (!userId) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }
    const member = await prisma.serverMember.findFirst({
      where: {
        serverId: id,
        userId,
        NOT: {
          status: "PENDING",
        },
      },
      select: memberDataSelect,
    });

    return Response.json(member);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
