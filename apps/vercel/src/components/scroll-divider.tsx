"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const ScrollDivider = () => {
  const show = React.useSyncExternalStore(
    (onStateChange) => {
      window.addEventListener("scroll", onStateChange);

      return () => {
        window.removeEventListener("scroll", onStateChange);
      };
    },
    () => !!window.scrollY,
    () => false,
  );

  const deferredShow = React.useDeferredValue(show);

  if (!deferredShow) {
    return null;
  }

  return (
    <React.ViewTransition>
      <Separator className={"shadow"} />
    </React.ViewTransition>
  );
};
