import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "user_followers";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("users.id").onDelete("CASCADE");
      table.integer("follower_id").unsigned().references("users.id").onDelete("CASCADE");
      table.unique(["user_id", "follower_id"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
