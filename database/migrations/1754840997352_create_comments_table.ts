import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "comments";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("content").notNullable();
      table.integer("user_id").notNullable().references("users.id");
      table
        .integer("post_id")
        .notNullable()
        .references("posts.id")
        .onDelete("CASCADE");
      table.integer("parent_comment_id").nullable().references("comments.id");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
