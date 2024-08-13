"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ServerValue, serverSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { createServer } from "./createServer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loadingButton";
import { Camera } from "lucide-react";
import { uploadFile } from "@/app/utils/fileUpload";

export default function ServerForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [error, setError] = useState<String>();
  const [isPending, startTransition] = useTransition();

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;

    const file = event.target.files[0];

    const urlImage = URL.createObjectURL(file);

    setFile(file);
    setPreview(urlImage);
  };

  const form = useForm<ServerValue>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: ServerValue) => {
    setError(undefined);
    startTransition(async () => {
      const result = await createServer(values);

      if (result.error) return setError(result.error);
      if (!result.newServer) return;

      if (file) {
        uploadFile(file, result.newServer.id);
      }

      const oldServers = queryClient.getQueryData(["servers"]) as [];

      queryClient.setQueryData(["servers"], [...oldServers, result.newServer]);

      router.push(`/${result.newServer.id}`);
    });
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setPreview(undefined);
      setFile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isPending) {
      setIsOpen(false)
      form.reset();
      setPreview(undefined);
      setFile(null);
      
    }
  }, [isPending]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="my-2 cursor-pointer rounded-lg p-2 font-medium hover:bg-slate-800">
          <p>Add Server</p>
        </div>
      </SheetTrigger>
      <SheetContent className="border-none bg-accent-foreground text-[12px] text-slate-400">
        <SheetHeader>
          <SheetTitle className="my-4 flex items-center justify-center text-slate-400">
            Customize Your Server
          </SheetTitle>
          {/* <SheetDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </SheetDescription> */}
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && <p className="text-center text-destructive">{error}</p>}
            <FormField
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className=" flex flex-col items-center justify-center">
                  <FormControl>
                    <Input
                      className=" hidden h-20 w-20 rounded-full border-none"
                      type="file"
                      onChange={handleUploadedFile}
                    />
                  </FormControl>
                  <FormLabel className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                    {preview ? (
                      <>
                        <Avatar className="h-full w-full">
                          <AvatarImage className="object-cover" src={preview} />
                        </Avatar>
                      </>
                    ) : (
                      <Camera />
                    )}
                  </FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-none bg-slate-800"
                      placeholder="Server Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input className="border-none bg-slate-800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <LoadingButton loading={isPending} type="submit">
                Create
              </LoadingButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
