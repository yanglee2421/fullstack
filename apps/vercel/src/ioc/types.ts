import type { PgSQL } from "./pgsql";

export interface AppCradle {
  pgsql_url: string;
  AUTH_COOKIE_NAME: string;

  pgsql: PgSQL;
}
