/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";
import { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get("DB_CONNECTION", "pg"),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | SQLite
    |--------------------------------------------------------------------------
    |
    | Configuration for the SQLite database.  Make sure to install the driver
    | from npm when using this connection
    |
    | npm i sqlite3
    |
    */
    sqlite: {
      client: "sqlite",
      connection: {
        filename: Application.tmpPath("db.sqlite3"),
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run("PRAGMA foreign_keys=true", cb);
        },
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },
    /*
    |--------------------------------------------------------------------------
    | PostgreSQL
    |--------------------------------------------------------------------------
    |
    | Configuration for the PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: "pg",
      connection: {
        host: Env.get("PG_HOST", "192.168.0.100"),
        port: Env.get("PG_PORT", 5432),
        user: Env.get("PG_USER"),
        password: Env.get("PG_PASSWORD"),
        database: Env.get("PG_DB_NAME", "adonis-blog"),
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: "adonis_schema",
      },
      healthCheck: false,
      debug: false,
    },
  },
};

export default databaseConfig;
