import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { serverDataSelect } from '@/lib/types';

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const servers = await prisma.server.findMany({
      where: {
        ServerMember: {
          some: {
            userId: user.id,
            NOT:{
              status:"PENDING"
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      select: serverDataSelect
    });

    return Response.json(servers);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
