"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import MembersSection from "./(components)/membersSection";
import FriendSection from "./(components)/friendsSection";
import LoadingButton from "@/components/ui/loadingButton";
import { useState, useTransition } from "react";
import { SendFriendRequest } from "./sendFriendRequest";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouselMini";
import FriendRequestCarousel from "../(components)/friendRequestCarousel";
export default function RightSide() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const handleSendingFriendRequest = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("tag", tag);
      const result = await SendFriendRequest(formData);
      if (!result) {
        toast(`Friend request sent to ${name}#${tag}.`, {
          duration: 1000,
          position: "top-right",
          className: "bg-secondary-foreground text-slate-400 border-none",
        });
        return;
      }

      if (result.error) {
        toast(result.error, {
          duration: 1000,
          position: "top-right",
          className: "bg-secondary-foreground text-slate-400 border-none",
        });
        return;
      }
    });
  };

  return (
    <Tabs defaultValue="members" className="flex h-[94vh] w-[250px] flex-col">
      <TabsList className="grid w-full grid-cols-2 bg-card-foreground">
        <TabsTrigger
          value="members"
          className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-400"
        >
          Members
        </TabsTrigger>
        <TabsTrigger
          value="friends"
          className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-400"
        >
          Friends
        </TabsTrigger>
      </TabsList>
      <TabsContent value="members" className="grow ">
        <MembersSection />
      </TabsContent>
      <TabsContent value="friends" className="grow ">
        <FriendSection />
      </TabsContent>
      <FriendRequestCarousel />
      <div className="grid h-9 w-full grid-cols-3 gap-2 ">
        <Input
          className="border-none bg-slate-800"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Name"
        />
        <Input
          className="border-none bg-slate-800"
          maxLength={4}
          onChange={(e) => {
            setTag(e.target.value);
          }}
          placeholder="Tag"
        />
        <LoadingButton
          onClick={handleSendingFriendRequest}
          loading={isPending}
          type="button"
        >
          Send
        </LoadingButton>
      </div>
      <Toaster />
    </Tabs>
  );
}
