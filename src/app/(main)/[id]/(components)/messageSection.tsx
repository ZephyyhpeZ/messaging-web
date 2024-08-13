'use client';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageData } from '@/lib/types';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef, useState } from 'react';

export default function MessageSection() {
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const query = useQuery<[MessageData]>({
    queryKey: ['messages', id],
    queryFn: async () => {
      const res = await fetch(`/api/server/message?id=${id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    }
  });

  useEffect(() => {

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [query.data]);

  if (query.status === 'pending') {
    return (
      <div className=" overflow-hidden h-full text-[12px]  w-full ">
        {[...Array(10)].map((_, index) => (
          <div className="flex items-center space-x-4 m-0 my-4">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="flex flex-row space-x-2">
                <Skeleton className="h-4 w-[80px] bg-slate-800" />
                <Skeleton className="h-4 w-[40px] bg-slate-800" />
              </div>
              <Skeleton className="h-4 w-[200px] bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (query.status === 'error') {
    return (
      <ScrollArea className=" h-full rounded-md text-[12px]  ">
        <p className="text-center text-destructive">
          An error occurred while loading posts.
        </p>
      </ScrollArea>
    );
  }

  return (
    <>
      <ScrollArea className="grow break-all text-[14px]">
        {query.data.map((message) => (
          <div
            key={message.id}
            className="item-center flex h-auto border-b border-neutral-800 bg-foreground py-3 leading-none text-slate-400 hover:border-secondary-foreground hover:bg-secondary-foreground "
          >
            <Avatar className="">
              <AvatarImage
                src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${message.user.id}`}
              />
              <AvatarFallback>{message.user.username}</AvatarFallback>
            </Avatar>
            <div className="ml-2 flex flex-col space-y-2 ">
              <div className="item-center flex flex-row space-x-2 leading-none">
                <div className="font-bold text-red-500 ">
                  {message.user.username}
                </div>
                <div className="text-[10px]">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
                <div>{message.edited ? "edited" : ""}</div>
              </div>
              <div className=" mr-2 text-slate-200">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
    </>
  );
}
