"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { formatedFriendData, friendData } from "@/lib/types";
import LoadingButton from "@/components/ui/loadingButton";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { inviteFriends } from "./inviteFriends";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function InviteUserComponent() {
  const params = useParams();
  const query = useQuery<[formatedFriendData]>({
    queryKey: ["friendsNotMember", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/friend/not-member?id=${params.id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const form = useForm();

  const [isPending, startTransition] = useTransition();
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      const id = params.id as string;
      const result = await inviteFriends(selectedFriends, id);
      if (!result) {
        toast(`Invited.`, {
          duration: 1000,
          position: "top-right",
          className: "bg-slate-800 text-slate-400 border-none",
        });
        query.refetch();

        return;
      }
      if (result.error) {
        toast(result.error, {
          duration: 1000,
          position: "top-right",
          className: "bg-slate-800 text-slate-400 border-none",
        });
        return;
      }
    });
  };

  const handleCheckedChange = (friendId: string) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId],
    );
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full cursor-pointer  hover:bg-slate-800 h-[35px] rounded-lg">
        Invite
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-full max-w-lg border-none bg-secondary-foreground p-6 text-slate-400">
        <DialogHeader>
          <DialogTitle>Friends List</DialogTitle>
          {/* <DialogDescription>
            Below is the list of all your friends.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
            <ScrollArea className="mt-4 h-[60vh] overflow-auto border-x-slate-400 ">
              {query.data?.map((friend) => (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem
                      onClick={() => {
                        handleCheckedChange(friend.user.id);
                      }}
                    >
                      <FormLabel
                        key={friend.id}
                        className="group mt-2 flex w-full cursor-pointer rounded-lg flex-row items-center px-4 py-2 hover:bg-slate-800"
                      >
                        <Avatar>
                          <AvatarImage
                            className="object-cover"
                            src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/${friend.user.id}`}
                          />
                          <AvatarFallback>
                            {friend.user.username}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex flex-grow flex-col">
                          <div className="font-bold">
                            {friend.user.displayName}#
                            {friend.user.discriminator}
                          </div>
                        </div>
                        <FormControl>
                          <div
                            className={`text-sm ${
                              selectedFriends.includes(friend.user.id)
                                ? "text-green-500 group-hover:text-green-700"
                                : "text-slate-400 group-hover:text-green-700"
                            }`}
                          >
                            {selectedFriends.includes(friend.user.id)
                              ? "Selected"
                              : "Select"}
                          </div>
                        </FormControl>
                      </FormLabel>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </ScrollArea>

            <LoadingButton className="items-center justify-center" loading={isPending} type="submit">
              Invite
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
      <Toaster className="" />
    </Dialog>
  );
}
