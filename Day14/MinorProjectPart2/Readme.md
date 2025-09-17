=> npm uninstall esm
=> npm install knex
=> npx knex migrate:make create_cart_items --knexfile knexfile.js
=> you need all the previous migration file if you can't provide it delete your knex_migration , knex_migration_lock
=> npx knex migrate:latest --knexfile knexfile.js
