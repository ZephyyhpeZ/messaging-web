'use server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { serverSchema, ServerValue } from '@/lib/validation';
import { generateIdFromEntropySize } from 'lucia';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';

export async function deleteServer(serverId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: 'User not authenticated.' };
    }

    const server = await prisma.server.findUnique({
      where: { id: serverId }
    });

    if (!server) {
      return { error: 'Server does not exist.' };
    }

    if (server.ownerId !== user.id) {
      return { error: 'You do not have permission to delete the server.' };
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.message.deleteMany({
        where: { serverId: serverId }
      });

      await prisma.serverMember.deleteMany({
        where: { serverId: serverId }
      });

      await prisma.server.delete({
        where: { id: serverId }
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting server:', error);
    return { error: 'An error occurred while deleting the server.' };
  }
}
