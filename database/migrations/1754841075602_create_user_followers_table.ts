import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "user_followers";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .references("users.id")
        .notNullable()
        .onDelete("CASCADE");
      table
        .integer("follower_id")
        .references("users.id")
        .notNullable()
        .onDelete("CASCADE");
      table.unique(["user_id", "follower_id"]);

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
