import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "comments";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("content").notNullable();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .notNullable()
        .references("posts.id")
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
