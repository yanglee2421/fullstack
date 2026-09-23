import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface GuestLayoutProps {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}

export default async function GuestLayout(props: GuestLayoutProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const lang = await props.params;

  if (accessToken) {
    redirect("/dashboard");
  }

  return props.children;
}
