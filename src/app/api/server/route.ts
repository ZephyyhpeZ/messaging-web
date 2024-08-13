import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
// import { postDataInclude } from "@/lib/types";
import { serverDataSelect } from '@/lib/types';

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

    const server = await prisma.server.findUnique({
      where: { id },
      select: serverDataSelect
    });

    return Response.json(server);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
