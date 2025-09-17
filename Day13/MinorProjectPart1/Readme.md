Guide for migrations and migrate in postgres with knex
=> install `npm i knex`
=> Write a knexfile.js define about db and migrations
=> Create a migrations `npx knex --knexfile knexfile.js migrate:make create_users_table`
for module
=> Edit migration according to our need
=> Make sure migrations in a ESM if using type:"module"
=> npx knex migrate:latest --knexfile knexfile.js
