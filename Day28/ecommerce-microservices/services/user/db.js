// db.js
import knex from "knex";
import config from "./Knexfile.js";

const db = knex(config.development);

export default db;
