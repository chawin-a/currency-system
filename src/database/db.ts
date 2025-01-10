import { Pool } from 'pg';

const pools = new Pool({
  user: process.env.POSTGRES_USERNAME ?? "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  database: process.env.POSTGRES_DATABASE ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "12345678",
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
})

export default pools