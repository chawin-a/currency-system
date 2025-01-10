import { logger } from '../logger'
import pools from './db'

export interface User {
  user_id: number
  username: string
  created_at: string
}

export async function getUserBy(id: number): Promise<User> {
  const sql = await pools.connect()
  const res = await pools.query(`
    SELECT
      user_id,
      username,
      created_at
    FROM users
    WHERE user_id = $1  
  `, [id])
  await sql.release();
  return res.rows[0] as User
}