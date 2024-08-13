"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Circle, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatedFriendData, friendData } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HandleFriendRequest } from "../handleFriendRequest";
import { useSession } from "../../../utils/sessionProvider";
import { useEffect } from "react";
import { usePusher } from "@/app/utils/pusherProvider";

export default function FriendSection() {
  const { user } = useSession();
  const query = useQuery<[formatedFriendData]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await fetch(`/api/friend`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  const pusher = usePusher();

  useEffect(() => {
    const channels = new Set<string>();

    query.data?.forEach((friend: any) => {
      const friendId = friend.user.id;
      const channelName = `presence${friendId}`;
      console.log(channelName);

      if (!channels.has(channelName)) {
        const channel = pusher.subscribe(channelName);

        channel.bind("update", (friend: any) => {
         query.refetch()
        });

        channels.add(channelName);
      }
    });

    return () => {
      channels.forEach((channelName) => {
        pusher.unsubscribe(channelName);
      });
    };
  }, [query]);

  if (query.status === "pending") {
    return (
      <div className="flex flex-1">
        <ScrollArea className=" w-full grow rounded-md text-[12px] ">
          <div className="flex items-center space-x-4 ">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="flex flex-row space-x-2">
                <Skeleton className="h-4 w-[80px] bg-slate-800" />
                <Skeleton className="h-4 w-[40px] bg-slate-800" />
              </div>
              <Skeleton className="h-4 w-[200px] bg-slate-800" />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (query.status === "error") {
    return (
      <ScrollArea className=" h-full rounded-md text-[12px]  ">
        <p className="text-center text-destructive">
          An error occurred while loading posts.
        </p>
      </ScrollArea>
    );
  }
  return (
    <div className="flex w-full grow flex-col">
      <ScrollArea className=" w-full grow rounded-md text-[12px] ">
        {query.data.map((friend) => (
          <Popover>
            <ContextMenu>
              <PopoverTrigger className="w-full">
                <ContextMenuTrigger className="w-full">
                  <div
                    key={friend.id}
                    className="item-center mt-2 flex  w-full cursor-pointer flex-row py-1 hover:bg-accent-foreground"
                  >
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${friend.user.id}`}
                      />
                      <AvatarFallback>{friend.user.username}</AvatarFallback>
                    </Avatar>
                    <div className=" ml-2 space-x-1 font-bold">
                        {friend.user.displayName}#{friend.user.discriminator}
                    </div>
                  </div>
                </ContextMenuTrigger>
              </PopoverTrigger>
              <ContextMenuContent className="border-none bg-secondary-foreground text-[12px] text-slate-400">
                <ContextMenuItem
                  className=""
                  onClick={async () => {
                    await HandleFriendRequest(friend.id, "REJECT");
                    query.refetch();
                  }}
                >
                  Unfriend
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <PopoverContent side="left" className="rounded-xl border-none p-0">
              {friend.user.id == user.id ? (
                <div className="h-[300px] rounded-md bg-accent-foreground text-[12px] text-slate-400">
                  <div className="relative w-full">
                    <AspectRatio
                      ratio={16 / 6}
                      className=" w-full rounded-t-3xl bg-muted"
                    >
                      <img
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/banner-${friend.user.id}`}
                        className="h-[120px] w-full rounded-t-xl object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </AspectRatio>
                    <Avatar className="absolute h-16 w-16 -translate-y-7 translate-x-4">
                      <AvatarImage
                        className="object-cover"
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${friend.user.id}`}
                      />
                      <AvatarFallback>{friend.user.username}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-5 p-4">
                    <div className="flex flex-row items-center space-x-1">
                      <div className="text-[16px] font-bold">
                        {friend.user.username}
                      </div>
                    </div>

                    <div className="item-center mb-7 flex">
                      <div className="">{friend.user.displayName}</div>
                      <div className="">#{friend.user.discriminator}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] rounded-md bg-accent-foreground text-[12px] text-slate-400">
                  <div className="relative w-full">
                    <AspectRatio
                      ratio={16 / 6}
                      className=" w-full rounded-t-3xl bg-muted"
                    >
                      <img
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/banner-${friend.user.id}`}
                        className="h-[120px] w-full rounded-t-xl object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </AspectRatio>
                    <Avatar className="absolute h-16 w-16 -translate-y-7 translate-x-4">
                      <AvatarImage
                        className="object-cover"
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${friend.user.id}`}
                      />
                      <AvatarFallback>{friend.user.username}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-5 p-4">
                    <div className="flex flex-row items-center space-x-1">
                      <div className="text-[16px] font-bold">
                        {friend.user.username}
                      </div>
                    </div>

                    <div className="item-center mb-7 flex">
                      <div className="">{friend.user.displayName}</div>
                      <div className="">#{friend.user.discriminator}</div>
                    </div>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        ))}
      </ScrollArea>
    </div>
  );
}
