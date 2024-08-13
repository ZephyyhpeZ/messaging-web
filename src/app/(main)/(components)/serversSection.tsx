"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ServerData } from "@/lib/types";
import { Loader2 } from "lucide-react";

import Link from "next/link";
import { useSession } from "../../utils/sessionProvider";
import LoadingButton from "@/components/ui/loadingButton";
import { useEffect, useState, useTransition } from "react";
import { deleteServer } from "./deleteServer";
import { useRouter } from "next/navigation";
import { handleServerLeave } from "../[id]/handleServer";
import EditServerForm from "./editServerForm";

export default function ServersSection() {
  const [error, setError] = useState<String>();
  const [serverNameTyped, setServerNameTyped] = useState<String>();
  const { user } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const query = useQuery<[ServerData]>({
    queryKey: ["servers"],
    queryFn: async () => {
      const res = await fetch("/api/server/all");
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });
  useEffect(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending]);
  if (query.status === "pending") {
    return (
      <ScrollArea className=" h-[95vh] w-full rounded-md pt-10 text-[12px] ">
        <Loader2 className="mx-auto animate-spin" />
      </ScrollArea>
    );
    return;
  }

  if (query.status === "error") {
    return (
      <ScrollArea className=" h-[95vh] w-full rounded-md pt-10 text-[12px] ">
        <p className="text-center text-destructive">
          An error occurred while loading posts.
        </p>
      </ScrollArea>
    );
  }

  const handleDelete = async (serverName: string, serverId: string) => {
    console.log(serverName);
    console.log(serverNameTyped);

    if (serverName !== serverNameTyped) {
      return setError("error");
    }

    startTransition(async () => {
      setError(undefined);
      startTransition(async () => {
        const { error } = await deleteServer(serverId);
        if (error) setError(error);
        queryClient.invalidateQueries({
          queryKey: ["servers"],
        });
        router.push("/");
      });
    });
  };

  return (
    <ScrollArea className=" w-full grow rounded-md text-[12px] ">
      {query.data.map((server) => (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <ContextMenu key={server.id}>
            <ContextMenuTrigger>
              <ContextMenuContent className="border-none bg-secondary-foreground text-[12px] text-slate-400">
                <ContextMenuItem
                  onClick={async () => {
                    await handleServerLeave(server.id, user.id);
                    query.refetch();
                  }}
                >
                  Leave
                </ContextMenuItem>
              </ContextMenuContent>
              <Link href={`/${server.id}`}>
                <div
                  key={server.id}
                  className="mt-2 flex cursor-pointer flex-row items-center rounded-lg px-1 py-1 hover:bg-accent-foreground"
                >
                  <Avatar>
                    <AvatarImage
                      className="object-cover"
                      src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${server.id}`}
                    />
                    <AvatarFallback>{server.name}</AvatarFallback>
                  </Avatar>
                  <div className="item-center ml-2 flex flex-col">
                    <div className="font-bold">{server.name}</div>
                  </div>
                </div>
              </Link>
            </ContextMenuTrigger>
          </ContextMenu>
          <DialogContent className="border-none bg-secondary-foreground sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-slate-400">
                Delete '{server.name}'
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {server.name} this action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className=" py-4">
              <div className="">
                <Label htmlFor="name" className="text-right text-slate-400">
                  Enter Server Name
                </Label>
                <Input
                  id="name"
                  onChange={(e) => setServerNameTyped(e.target.value)}
                  className="border-none bg-slate-800 text-slate-400"
                />
                {error && (
                  <div className="text-[12px] text-destructive">
                    you didn't enter the server name correctly
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <LoadingButton
                loading={isPending}
                onClick={() => {
                  handleDelete(server.name, server.id);
                }}
                type="submit"
              >
                Delete Server
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </ScrollArea>
  );
}
