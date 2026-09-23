"use server";

import { container } from "@/ioc";
import { schema } from "db/postgres";
import { eq, count as sqlCount } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const postgres = container.cradle.pgsql.client;
const setAccessCookie = async (accessToken: string) => {
  const cookie = await cookies();

  cookie.set("accessToken", accessToken, {
    maxAge: 60 * 60 * 24 * 7,
  });
  revalidatePath("/");
};

export const saveAction = async (accessToken: string) => {
  await postgres
    .insert(schema.credentials)
    .values({ accessToken })
    .onConflictDoNothing({ target: schema.credentials.accessToken });
  await setAccessCookie(accessToken);
};

interface AddActionInput {
  date: string;
  duration: number;
  note: string;
}

export const addAction = async (value: AddActionInput) => {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  if (!accessToken) {
    throw new Error("Access Token is required!");
  }

  const [credential] = await postgres
    .select()
    .from(schema.credentials)
    .where(eq(schema.credentials.accessToken, accessToken));

  if (!credential) {
    throw new Error("Invalid access token");
  }

  await postgres.insert(schema.overtimes).values({
    date: new Date(value.date),
    duration: value.duration,
    note: value.note,
    credentialId: credential.id,
  });

  await setAccessCookie(accessToken);
  revalidatePath("/");
};

export const queryAction = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value || "";
  const [credential] = await postgres
    .select()
    .from(schema.credentials)
    .where(eq(schema.credentials.accessToken, accessToken));

  if (!credential) {
    throw new Error("Invalid access token");
  }

  const query = postgres
    .select()
    .from(schema.overtimes)
    .where(eq(schema.overtimes.credentialId, credential.id));
  const [{ count }] = await postgres
    .select({ count: sqlCount() })
    .from(query.as("rows"));
  const rows = await query;

  await setAccessCookie(accessToken);

  return { count, rows };
};

export const logoutAction = async () => {
  const cookie = await cookies();

  cookie.delete("accessToken");
  revalidatePath("/");
};
