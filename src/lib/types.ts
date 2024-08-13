import { Prisma } from "@prisma/client";

export const serverDataSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  ownerId: true,
} satisfies Prisma.ServerSelect;

export type ServerData = Prisma.ServerGetPayload<{
  select: typeof serverDataSelect;
}>;


export const messageDataSelect = {
  id: true,
  content: true,
  serverId: true,
  timestamp: true,
  edited: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
} satisfies Prisma.MessageSelect;

export type MessageData = Prisma.MessageGetPayload<{
  select: typeof messageDataSelect;
}>;

export const memberDataSelect = {
  id: true,
  role: true,
  status: true,
  joinedAt: true,
  invitedAt: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      discriminator: true,
    }
  },
  server:{
    select:{
      id:true,
      name:true,
    }
  }
} satisfies Prisma.ServerMemberSelect;

export type MemberData = Prisma.ServerMemberGetPayload<{
  select: typeof memberDataSelect;
}>;

export const friendDataSelect = {
  id: true,
  status: true,
  userId: true,
  friendId: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      discriminator: true,
    },
  },
  friend: {
    select: {
      id: true,
      username: true,
      displayName: true,
      discriminator: true,
    },
  },
};

export type friendData = Prisma.FriendGetPayload<{
  select: typeof friendDataSelect;
}>;

export const formatedFriendDataSelect = {
  id: true,
  status: true,
  userId: true,
  friendId: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      discriminator: true,
    },
  },

};

export type formatedFriendData = Prisma.FriendGetPayload<{
  select: typeof formatedFriendDataSelect;
}>;