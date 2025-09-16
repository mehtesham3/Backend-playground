/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table
      .enu("role", ["user", "admin"], { useNative: true, enumName: "user_role" })
      .notNullable()
      .defaultTo("user");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("role");
  });
  await knex.raw('DROP TYPE IF EXISTS "user_role";'); // remove enum type
}
