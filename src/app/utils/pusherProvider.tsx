"use client"
import { createContext, useContext, useMemo, ReactNode } from "react";
import Pusher from "pusher-js";

export const PusherContext = createContext<Pusher | undefined>(undefined);

export const PusherProvider = ({ children }: { children: ReactNode }) => {
  const pusher = useMemo(() => {
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: "ap1",
    });
  }, []);

  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};

export const usePusher = (): Pusher => {
  const context = useContext(PusherContext);

  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }

  return context;
};
