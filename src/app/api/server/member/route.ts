import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { memberDataSelect } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    const members = await prisma.serverMember.findMany({
      where: {
        serverId: id,
        NOT: {
          status: "PENDING",
        },
      },
      select: memberDataSelect,
    });

    return Response.json(members);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
