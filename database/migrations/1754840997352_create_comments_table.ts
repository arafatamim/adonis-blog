import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "comments";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.text("content").notNullable();
      table
        .integer("parent_comment_id")
        .unsigned()
        .references("id")
        .inTable("comments")
        .nullable()
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNullable()
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .references("id")
        .inTable("posts")
        .notNullable()
        .onDelete("CASCADE");

      // threading
      table.integer("depth").unsigned().defaultTo(0);
      table.string("thread_path").nullable();

      // performance counters
      table.integer("replies_count").unsigned().defaultTo(0);

      // flags
      table.boolean("is_deleted").defaultTo(false);

      // timestamps
      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").notNullable();

      // indexes
      table.index(["post_id", "created_at"]);
      table.index(["parent_comment_id"]);
      table.index(["user_id"]);
      table.index(["thread_path"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
