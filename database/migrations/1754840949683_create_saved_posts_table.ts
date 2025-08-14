import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "saved_posts";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .references("users.id")
        .notNullable()
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .references("posts.id")
        .notNullable()
        .onDelete("CASCADE");
      table.unique(["user_id", "post_id"]);

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
