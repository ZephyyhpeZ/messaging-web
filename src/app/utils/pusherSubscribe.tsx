"use client";
import { validateRequest } from "@/auth";
import { usePusher } from "./pusherProvider";
import { useEffect } from "react";

export default async function Home() {
  const session = await validateRequest();

  return <></>;
}
