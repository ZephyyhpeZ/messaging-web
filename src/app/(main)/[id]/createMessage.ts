'use server';
import { validateRequest } from '@/auth';
import { generateIdFromEntropySize } from 'lucia';
import prisma from '@/lib/prisma';
import { messageDataSelect } from '@/lib/types';

export async function createMessage(formData: FormData) {
  const Pusher = require('pusher');
  const { user } = await validateRequest();
  if (!user) {
    return { error: 'User not authenticated.' };
  }
  const message = formData.get('message') as string;
  const serverId = formData.get('serverId') as string;

  const userId = user.id;

  const id = generateIdFromEntropySize(10);

  await prisma.message
    .create({
      data: { id, content: message, serverId, userId },
      select: messageDataSelect
    })
    .then((data) => {
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: 'ap1',
        useTLS: true
      });

      pusher.trigger(`channel-${serverId}`, 'message', {
        data
      });
    });
}
