/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  await knex.schema.createTable("categories", (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string("name").notNullable().unique();
  });

  await knex.schema.createTable("brands", (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string("name").notNullable().unique();
  });

  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable();
    table.integer("stock").defaultTo(0);
    table.uuid("category_id").references("id").inTable("categories").onDelete("CASCADE");
    table.uuid("brand_id").references("id").inTable("brands").onDelete("CASCADE");

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("brands");
  await knex.schema.dropTableIfExists("categories");
};

