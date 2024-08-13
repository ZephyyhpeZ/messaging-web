"use client";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ServerData } from "@/lib/types";
import EditServerForm from "../../(components)/editServerForm";

export default function MiddleTop() {
  const { id } = useParams();

  const query = useQuery<ServerData>({
    queryKey: ["server", id],
    queryFn: async () => {
      const res = await fetch(`/api/server?id=${id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (query.status === "pending") {
    return (
      <div className="z-10 flex h-[60px] flex-row py-1 shadow-[#1e293b_0px_1.5px_0px_0px] ">
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
    <div className=" py-1 shadow-[#1e293b_0px_1.5px_0px_0px] z-10 flex flex-row  justify-between items-center">
      <div className="  flex flex-row ">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${query.data.id}`}
          />
          <AvatarFallback>{query.data.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="ml-2 text-[18px] font-medium">{query.data.name}</div>
          <div className="ml-2 font-medium">{query.data.description}</div>
        </div>
      </div>
      <EditServerForm />
    </div>
  );
}
