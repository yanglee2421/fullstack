"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import React from "react";

export default function Page() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-1.5">
        <Button
          onClick={() => {
            React.startTransition(() => {
              setOpen((p) => !p);
            });
          }}
        >
          startTransition
        </Button>
        <Button
          onClick={() => {
            setOpen((p) => !p);
          }}
        >
          setOpen
        </Button>
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis aut
        voluptate quidem a vero tempora, eaque exercitationem at officia, porro
        voluptatum assumenda quia tenetur! Accusantium reprehenderit quam
        mollitia fuga atque?
      </div>
      {open && (
        <React.ViewTransition>
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>description</CardDescription>
              <CardAction>
                <Button variant={"ghost"} size={"icon"}>
                  <RefreshCcw />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>React ViewTransition</CardContent>
            <CardFooter></CardFooter>
          </Card>
        </React.ViewTransition>
      )}
    </div>
  );
}
