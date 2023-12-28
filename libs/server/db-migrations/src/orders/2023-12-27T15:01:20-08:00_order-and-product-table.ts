import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("order_status")
    .asEnum(["created", "cancelled", "awaiting:payment", "complete"])
    .execute();

  await db.schema
    .createTable("product")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("order")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("status", sql`order_status`, (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("product_id", "serial", (col) => col.references("product.id").notNull())
    .execute();

  await db.schema.createIndex("order_product_id").on("order").column("product_id").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("order").execute();
  await db.schema.dropTable("product").execute();
  await db.schema.dropType("order_status").execute();
  await db.schema.dropIndex("order_product_id").on("order").execute();
}
