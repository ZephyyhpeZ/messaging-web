import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { messageDataSelect } from '@/lib/types';
import { NextResponse } from 'next/server';

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

    const messages = await prisma.message.findMany({
      where: {
        serverId: id
      },
      select: messageDataSelect
    });

    return Response.json(messages);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
