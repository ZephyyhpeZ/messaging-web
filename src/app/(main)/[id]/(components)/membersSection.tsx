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
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { MemberData } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Checkbox } from "@/components/ui/checkbox";
import InviteUserComponent from "./inviteUserComponent";
import { handleServerLeave } from "../handleServer";
import { useSession } from "@/app/utils/sessionProvider";
import { useEffect, useState } from "react";
export default function MembersSection() {
  const { id }: { id: string } = useParams();
  const { user } = useSession();
  const [userRole, setUserRole] = useState(null);
  const query = useQuery<[MemberData]>({
    queryKey: ["members", id],
    queryFn: async () => {
      const res = await fetch(`/api/server/member?id=${id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await fetch(
        `/api/server/member/current?id=${id}&userId=${user.id}`,
      );
      const data = await response.json();
      setUserRole(data.role);
    };

    fetchUserRole();
  }, [id]);

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
    <div className="flex grow  ">
      <ScrollArea className=" w-full grow rounded-md text-[12px] ">
        {/* Content for right sidebar */}
        <InviteUserComponent />

        {query.data.map((member) => (
          <Popover>
            <ContextMenu>
              <PopoverTrigger className="w-full">
                <ContextMenuTrigger className="w-full">
                  <div
                    key={member.id}
                    className="mt-2 flex w-full cursor-pointer flex-row py-1 hover:bg-accent-foreground"
                  >
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v1723177984/${member.user.id}`}
                      />
                      <AvatarFallback>{member.user.username}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex flex-col ">
                      <div className="flex flex-row items-center space-x-1">
                        <div className="font-bold">
                          {member.user.displayName}#{member.user.discriminator}
                        </div>
                        {member.role == "OWNER" && (
                          <Crown
                            className="h-3 w-3"
                            fill="ffaf24"
                            color="#ffaf24"
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 "></div>
                    </div>

                    {/* <Separator orientation="horizontal" /> */}
                  </div>
                </ContextMenuTrigger>
              </PopoverTrigger>
              {userRole === "OWNER" && member.role != "OWNER" && (
                <ContextMenuContent
                  onClick={async () => {
                    if (!id) return;
                    await handleServerLeave(id, member.user.id);
                    query.refetch();
                  }}
                  className="border-none bg-secondary-foreground text-[12px] text-slate-400"
                >
                  {/* <ContextMenuItem>Block</ContextMenuItem> */}
                  <ContextMenuItem>Kick</ContextMenuItem>
                </ContextMenuContent>
              )}
            </ContextMenu>
            <PopoverContent side="left" className="rounded-xl border-none p-0">
              <div className="h-[300px] rounded-md bg-accent-foreground text-[12px] text-slate-400">
                <div className="relative w-full">
                  <AspectRatio
                    ratio={16 / 6}
                    className=" w-full rounded-t-3xl bg-muted"
                  >
                    <img
                      src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/banner-${member.user.id}`}
                      className="h-[120px] w-full rounded-t-xl object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </AspectRatio>
                  <Avatar className="absolute h-16 w-16 -translate-y-7 translate-x-4">
                    <AvatarImage
                      className="object-cover"
                      src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${member.user.id}`}
                    />
                    <AvatarFallback>{member.user.username}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-5 p-4">
                  <div className="flex flex-row items-center space-x-1">
                    <div className="text-[16px] font-bold">
                      {member.user.username}
                    </div>
                    {member.role == "OWNER" && (
                      <Crown
                        className="h-3 w-3"
                        fill="ffaf24"
                        color="#ffaf24"
                      />
                    )}
                  </div>

                  <div className="item-center mb-7 flex">
                    <div className="">{member.user.displayName}</div>
                    <div className="">#{member.user.discriminator}</div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </ScrollArea>
    </div>
  );
}
