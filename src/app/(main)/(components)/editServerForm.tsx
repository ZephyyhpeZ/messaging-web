"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, PenIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Pencil } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import {
  ProfileValue,
  ServerValue,
  fileSchema,
  profileSchema,
  serverSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { editProfile } from "./editProfile";
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
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loadingButton";
import { useSession } from "../../utils/sessionProvider";
import { uploadFile } from "@/app/utils/fileUpload";
import { updateUserData } from "../updateUserData";
import { editServer } from "./editServer";
import { ServerData } from "@/lib/types";

export default function EditServerForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [serverData, setServerData] = useState<ServerData>();

  const [error, setError] = useState<String>();
  const [isPending, startTransition] = useTransition();

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;

    const file = event.target.files[0];

    const urlImage = URL.createObjectURL(file);

    setFile(file);
    setPreview(urlImage);
  };
  const { id }: { id: string } = useParams();

  useEffect(() => {
    const data = queryClient.getQueryData<ServerData>(["server", id]);

    if (data) {
      setServerData(data);
      console.log(data);
    }
  }, [queryClient, id]);

  const form = useForm<ServerValue>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  useEffect(() => {
    if (serverData) {
      form.reset({
        name: serverData.name,
        description: serverData.description,
      });
    }
  }, [serverData, form]);
  const onSubmit = async (values: ServerValue) => {
    setError(undefined);
    startTransition(async () => {
      const result = await editServer(values, id);

      if (result.error) return setError(result.error);
      if (!result.updatedServer) return;

      if (file) {
        uploadFile(file, result.updatedServer.id);
      }

      queryClient.invalidateQueries(["server", id]);
      queryClient.invalidateQueries(["servers"]);
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
      setIsOpen(false);
      form.reset();
      setPreview(undefined);
      setFile(null);
    }
  }, [isPending]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="">
        <PenIcon />
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
                    <Camera className="absolute" />

                    {!preview && (
                      <>
                        <Avatar className="h-full w-full">
                          <AvatarImage
                            className="object-cover"
                            src={`https://res.cloudinary.com/doimcmi2g/image/upload/v1723177984/${serverData?.id}`}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </Avatar>
                      </>
                    )}
                    {preview && (
                      <>
                        <Avatar className="h-full w-full">
                          <AvatarImage className="object-cover" src={preview} />
                        </Avatar>
                      </>
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
                Edit
              </LoadingButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
