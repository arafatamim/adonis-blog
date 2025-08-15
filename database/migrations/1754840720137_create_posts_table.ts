import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "posts";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.json("cover_image").nullable();
      table.text("content").notNullable();
      table.boolean("published").notNullable().defaultTo(false);
      table.string("slug").notNullable().unique();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
