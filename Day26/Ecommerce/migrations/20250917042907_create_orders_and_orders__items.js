/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("total_amount", 10, 2).notNullable().defaultTo(0.0);
    table
      .enu("status", ["pending", "shipped", "delivered", "cancelled"], {
        useNative: true,
        enumName: "order_status",
      })
      .notNullable()
      .defaultTo("pending");
    // optional idempotency key to avoid duplicate orders (nullable, unique)
    table.string("idempotency_key").nullable().unique();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("order_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .uuid("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price", 10, 2).notNullable(); // snapshot price at order time
    table.timestamps(true, true);
  });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  // optionally drop order_status type:
  await knex.raw('DROP TYPE IF EXISTS order_status;').catch(() => { });
};
