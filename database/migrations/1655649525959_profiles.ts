import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "profiles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name", 120).notNullable();
      table.json("avatar");
      table.string("website_url", 100).nullable();
      table.string("location", 80).nullable();
      table.string("bio", 255).nullable();

      table.integer("user_id").notNullable().unsigned().references("users.id").onDelete("CASCADE");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
