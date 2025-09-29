import "dotenv/config"

export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL ||
    {
      host: 'localhost',
      user: 'postgres',
      password: 'Angelica1!',
      database: 'ecommerce'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
