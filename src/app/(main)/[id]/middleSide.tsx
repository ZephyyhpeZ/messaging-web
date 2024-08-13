"use client";

import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageSection from "./(components)/messageSection";
import MiddleTop from "./(components)/middleTopSection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "./createMessage";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { usePusher } from "@/app/utils/pusherProvider";

export default function MiddleSide() {
  const [message, setMessage] = useState("");
  const params = useParams();
  const serverId = params.id;
  const queryClient = useQueryClient();
  const pusher = usePusher();

  useEffect(() => {
    const channel = pusher.subscribe(`channel-${serverId}`);

    const handleMessage = (message: any) => {
      
      const newMessage = message.data;

      const oldMessages = queryClient.getQueryData([
        "messages",
        newMessage.serverId,
      ]) as [];

      queryClient.setQueryData(
        ["messages", newMessage.serverId],
        [...oldMessages, newMessage],
      );
    };
    
    channel.bind("message", handleMessage);

    return () => {
      channel.unbind("message", handleMessage);
      pusher.unsubscribe(`channel-${serverId}`);
    };
  }, [serverId, queryClient]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      if (message == "") return;
      const id = params.id as string;
      const formData = new FormData();
      formData.append("message", message);
      formData.append("serverId", id);
      await createMessage(formData).then((response) => {
        setMessage("");
      });
    }
  };

  return (
    <div className="flex h-[96.3vh] flex-1 flex-col break-words px-4 pb-4">
      <MiddleTop />
      <MessageSection />
      <div className="w-full border-t border-neutral-800 pt-3 ">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className=" break-all border-none bg-secondary-foreground"
        />
      </div>
    </div>
  );
}
