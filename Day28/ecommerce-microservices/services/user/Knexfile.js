import 'dotenv/config';

const isDocker = process.env.DOCKER_ENV === 'true';

export default {
  development: {
    client: 'pg',
    connection:
      isDocker ? process.env.DATABASE_DOCKER_URL : process.env.DATABASE_LOCAL_URL ||
      {
        host: isDocker ? 'postgres' : 'localhost', // 👈 auto switch
        user: process.env.POSTGRES_USER || 'postgres',
        password: isDocker ? 'postgres' : 'Angelica1!', // 👈 auto switch
        database: isDocker ? 'ecommerce_db' : 'ecommerce',
      },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    },
  },
};
