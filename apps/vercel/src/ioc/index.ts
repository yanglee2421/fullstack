import { asClass, asValue, createContainer } from "awilix";
import { PgSQL } from "./pgsql";
import type { AppCradle } from "./types";

export const container = createContainer<AppCradle>({
  injectionMode: "PROXY",
  strict: true,
});

container.register({
  pgsql_url: asValue(process.env.POSTGRES_URL || ""),
  AUTH_COOKIE_NAME: asValue("auth_token"),

  pgsql: asClass(PgSQL)
    .singleton()
    .disposer((pgsql) => pgsql.dispose()),
});
