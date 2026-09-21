import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  description: "...",
};

export default function Page() {
  return (
    <div className="grid h-dvh place-items-center">
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-9xl">404</h1>
        <h2 className="text-3xl">Page Not Found</h2>
        <Button
          render={
            <Link href="/">
              <Home />
              Take me back
            </Link>
          }
          size={"lg"}
        />
      </div>
    </div>
  );
}
