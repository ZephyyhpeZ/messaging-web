"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loadingButton";
import { useSession } from "../../utils/sessionProvider";
import { uploadFile } from "@/app/utils/fileUpload";
import { updateUserData } from "../updateUserData";

export default function EditProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [bannerPreview, setBannerPreview] = useState<string | undefined>();
  const [userPreview, setUserPreview] = useState<string | undefined>();
  const [banner, setBanner] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [error, setError] = useState<String>();
  const [errorImage, setErrorImage] = useState<String>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileValue>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName,
      username: user.username,
      discriminator: user.discriminator,
    },
  });

  const handleUploadedBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;

    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const result = fileSchema.safeParse({ file });

    if (!result.success) {
      console.log(result.error);
      result.error.errors.forEach((error) => {
        setErrorImage(error.message);
      });
      return;
    }
    setErrorImage("");
    const urlImage = URL.createObjectURL(file);

    setBanner(file);
    setBannerPreview(urlImage);
  };

  const handleUploadedAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;

    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const result = fileSchema.safeParse({ file });

    if (!result.success) {
      console.log(result.error);
      result.error.errors.forEach((error) => {
        setErrorImage(error.message);
      });
      return;
    }

    setErrorImage("");
    const urlImage = URL.createObjectURL(file);

    setAvatar(file);
    setUserPreview(urlImage);
  };

  const onSubmit = async (values: ProfileValue) => {
    setError(undefined);
    startTransition(async () => {
      const result = await editProfile(values);
      if (!result) return;
      if (result.error) return setError(result.error);
      if (!result.updatedUser) return;
      const avatarId = result.updatedUser.id;
      if (avatar) {
        await uploadFile(avatar, avatarId);
      }
      const bannerId = "banner-" + result.updatedUser.id;
      if (banner) {
        await uploadFile(banner, bannerId);
      }
      updateUserData()
    });
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setBanner(null);
      setAvatar(null);
      setBannerPreview(undefined);
      setUserPreview(undefined);
    }
  }, [isOpen]);

  return (
    <Sheet onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className=" absolute right-0 z-10 mr-2 mt-2 cursor-pointer rounded-full bg-[#1E293B]/60 p-1 hover:bg-[#1E293B]/80">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Pencil fill="#dbdbdb" color="#dbdbdb" className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>
      <SheetContent className="border-none bg-accent-foreground text-[12px] text-slate-400">
        <SheetHeader>
          <SheetTitle className="my-4 flex items-center justify-center text-slate-400">
            Edit Profile
          </SheetTitle>
          {/* <SheetDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </SheetDescription> */}
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-x-3 rounded-t-xl "
          >
            {error && <p className="text-center text-destructive">{error}</p>}
            {errorImage && (
              <p className="text-center text-destructive">{errorImage}</p>
            )}

            <FormField
              name="bannerUrl"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormControl>
                    <Input
                      className=" hidden"
                      type="file"
                      onChange={handleUploadedBanner}
                    />
                  </FormControl>
                  <FormLabel
                    style={{ margin: "0px" }}
                    className="mt-0 flex h-[120px] w-full items-center justify-center rounded-t-xl bg-white"
                  >
                    <Camera className="absolute z-30" />
                    {!bannerPreview && (
                      <img
                        src={`https://res.cloudinary.com/doimcmi2g/image/upload/v${new Date().getTime()}/banner-${user.id}`}
                        className="h-[120px] w-full rounded-t-xl object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                    {bannerPreview && (
                      <AspectRatio
                        ratio={16 / 6}
                        className="rounded-t-3xl bg-muted"
                      >
                        <Image
                          src={bannerPreview}
                          alt=""
                          fill
                          className="rounded-t-xl object-cover"
                        />
                      </AspectRatio>
                    )}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className=" flex flex-col justify-center">
                  <FormControl>
                    <Input
                      className=" hidden h-16 w-16 rounded-full border-dashed"
                      type="file"
                      onChange={handleUploadedAvatar}
                    />
                  </FormControl>
                  <FormLabel className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-white">
                    <Camera className="absolute z-30" />
                    {!userPreview && (
                      <>
                        <Avatar className="h-full w-full">
                          <AvatarImage
                            className="object-cover"
                            src={`https://res.cloudinary.com/doimcmi2g/image/upload/v1723177984/${user.id}`}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </Avatar>
                      </>
                    )}
                    {userPreview && (
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          className="object-cover"
                          src={userPreview}
                        />
                      </Avatar>
                    )}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mt-14">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="w-1/2 border-none bg-slate-800 "
                      placeholder={user.username}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex w-full flex-row items-center space-x-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[100%] border-none bg-slate-800"
                        placeholder={user.displayName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex h-full flex-col ">
                <div className="">&#8205;</div>
                <div className="text-[20px] font-bold">#</div>
              </div>

              <FormField
                control={form.control}
                name="discriminator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>&#8205;</FormLabel>
                    <FormControl>
                      <Input
                        className="w-2/3 border-none bg-slate-800"
                        maxLength={4}
                        placeholder={user.discriminator}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <LoadingButton loading={isPending} type="submit">
                Save
              </LoadingButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
