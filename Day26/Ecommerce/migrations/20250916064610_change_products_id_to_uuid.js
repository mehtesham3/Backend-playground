/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("id"); // drop old integer ID
  });

  await knex.schema.alterTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {

  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("id");
    table.increments("id").primary();
  })

};
