"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { X, CheckCircle } from "lucide-react";
import LoadingButton from "@/components/ui/loadingButton";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouselMini";
import { friendData, MemberData } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleServerInvites } from "../[id]/handleServer";
export default function ServerInviteCarousel() {
  const queryClient = useQueryClient();

  const query = useQuery<[MemberData]>({
    queryKey: ["membersInvited"],
    queryFn: async () => {
      const res = await fetch(`/api/server/member/invite`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
    refetchInterval: 10000,
  });

  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState<string>("");

  const handleRequest = (friendId: string, status: string) => {
    startTransition(async () => {
      await handleServerInvites(friendId, status);
      query.refetch();
            queryClient.refetchQueries({
              queryKey: ["servers"],
            });
    });
  };

  return (
    <Carousel className="">
      <CarouselPrevious className="border-none bg-secondary-foreground" />
      <CarouselContent>
        {query.data?.map((invite) => (
          <CarouselItem
            key={invite.id}
            className="flex flex-col justify-center px-4 text-slate-400 "
          >
            <span className="text-bold">Invited to {invite.server.name}</span>
            <span className="text-bold">
              by {invite.user.displayName}#{invite.user.discriminator}
            </span>

            <div className="grid grid-cols-2">
              <div
                className="cursor-pointer hover:text-slate-600"
                onClick={() => {
                  handleRequest(invite.id, "ACCEPT");
                }}
              >
                Accept
              </div>
              <div
                className="cursor-pointer hover:text-slate-600"
                onClick={() => {
                  handleRequest(invite.id, "REJECT");
                }}
              >
                Reject
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="border-none bg-secondary-foreground hover:bg-slate-800" />
    </Carousel>
  );
}
