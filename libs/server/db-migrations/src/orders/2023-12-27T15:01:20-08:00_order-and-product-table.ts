import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("order_status")
    .asEnum(["created", "cancelled", "awaiting:payment", "complete"])
    .execute();

  await db.schema
    .createTable("product")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("version", "integer", (col) => col.notNull().check(sql`version >= 0`))
    .execute();

  await db.schema
    .createTable("order")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("status", sql`order_status`, (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("product_id", "text", (col) => col.references("product.id").notNull())
    .addColumn("version", "integer", (col) => col.notNull().defaultTo(0))
    .execute();

  await db.schema.createIndex("order_product_id").on("order").column("product_id").execute();

  await sql`
    CREATE OR REPLACE FUNCTION update_version()
    RETURNS TRIGGER
    AS $$
    BEGIN
      NEW.version = OLD.version + 1;
      RETURN NEW;
    END;
    $$ LANGUAGE PLPGSQL;
  `.execute(db);

  await sql`
    CREATE TRIGGER update_version_trigger
    BEFORE UPDATE
    ON order
    FOR EACH ROW
    EXECUTE PROCEDURE update_version();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION update_version;`.execute(db);
  await sql`DROP TRIGGER update_version_trigger;`.execute(db);
  await db.schema.dropTable("order").execute();
  await db.schema.dropTable("product").execute();
  await db.schema.dropType("order_status").execute();
  await db.schema.dropIndex("order_product_id").on("order").execute();
}
