'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function checkUser({
  session,
  serverId
}: {
  session: any;
  serverId: any;
}) {
  const { user } = session;

  const isUserExsit = await prisma.serverMember.findFirst({
    where: {
      userId: user.id,
      serverId
    }
  });

  if (!isUserExsit) {
     return redirect('/');
  }
}
