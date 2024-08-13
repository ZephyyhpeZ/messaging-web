"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Circle } from "lucide-react";
import { useSession } from "../utils/sessionProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import ServersSection from "./(components)/serversSection";
import ServerForm from "./(components)/serverForm";
import EditProfileForm from "./(components)/editProfileForm";
import { useEffect, useRef } from "react";
import { logout } from "../(auth)/logout/action";
import { useQueryClient } from "@tanstack/react-query";
import { usePusher } from "../utils/pusherProvider";
import { updateSession } from "./(components)/updateSession";
import ServerInviteCarousel from "./(components)/serverInvitedCarousel";

export default function LeftSide() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const imageRef = useRef<HTMLImageElement>(null);
  const status = {
    ONLINE: "Green",
    OFFLINE: "Grey",
    AWAY: "Yellow",
    BUSY: "Blue",
    INVISIBLE: "Grey",
    DO_NOT_DISTURB: "Red",
  };
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.display = "block";
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries();
  };

  const pusher = usePusher();

  useEffect(() => {
    pusher.subscribe(`presence${user.id}`);

    return () => {
      pusher.unsubscribe(`presence${user.id}`);
    };
  }, [user.id]);

  return (
    <div className="flex h-[94vh] w-[250px] flex-col ">
      <ServersSection />
      <ServerInviteCarousel/>
      <Popover>
        <PopoverTrigger className="flex flex-row rounded-lg border-t border-neutral-800 px-1 py-1 hover:bg-secondary-foreground">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${user.id}`}
            />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <div className="group ml-2 flex flex-col">
            <div className="item-center flex">
              <div className="font-bold">{user.username}</div>
            </div>
            <div className="item-center flex">
              <div className="font-bold">{user.displayName}</div>
              <div className="font-bold">#{user.discriminator}</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className=" rounded-xl border-none p-0">
          <div className="h-[300px] rounded-md bg-accent-foreground text-[12px] text-slate-400">
            <div className="relative w-full">
              <EditProfileForm />
              <AspectRatio
                ratio={16 / 6}
                className=" w-full rounded-t-3xl bg-muted"
              >
                <img
                  ref={imageRef}
                  src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/banner-${user.id}`}
                  className="h-[120px] w-full rounded-t-xl object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </AspectRatio>
              <Avatar className="absolute h-16 w-16 -translate-y-7 translate-x-4">
                <AvatarImage
                  className="object-cover"
                  src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${user.id}`}
                />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-5 p-4">
              <div className="text-[16px] font-bold">{user.username}</div>

              <div className="item-center mb-7 flex">
                <div className="">{user.displayName}</div>
                <div className="">#{user.discriminator}</div>
              </div>

              <ServerForm />
              <div
                className="my-2 flex cursor-pointer space-x-1 rounded-lg p-2 hover:bg-slate-800"
                onClick={handleLogout}
              >
                <div className=" leading-none ">Logout</div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
