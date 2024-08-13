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
import { friendData } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HandleFriendRequest } from "../[id]/handleFriendRequest";
export default function FriendRequestCarousel() {
  const queryClient = useQueryClient();

  const query = useQuery<[friendData]>({
    queryKey: ["friendRequest"],
    queryFn: async () => {
      const res = await fetch(`/api/friend/request`);
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
      await HandleFriendRequest(friendId, status);
      query.refetch();
      queryClient.refetchQueries({
        queryKey: ["friends"],
      });
    });
  };

  return (
    <Carousel className="">
      <CarouselPrevious className="border-none bg-secondary-foreground" />
      <CarouselContent>
        {query.data?.map((friend) => (
          <CarouselItem
            key={friend.id}
            className="flex flex-col justify-center px-4 text-slate-400 "
          >
            <span className="text-bold">
              {friend.user.displayName}#{friend.user.discriminator}
            </span>
            <div className="grid grid-cols-2">
              <div
                className="cursor-pointer hover:text-slate-600"
                onClick={() => {
                  handleRequest(friend.id, "ACCEPT");
                }}
              >
                Accept
              </div>
              <div
                className="cursor-pointer hover:text-slate-600"
                onClick={() => {
                  handleRequest(friend.id, "REJECT");
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
