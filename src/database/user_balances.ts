import pools from './db.js'

export interface UserBalance {
  user_id: number
  current_balance: number
  lock_version: number
  created_at: string
  updated_at: string
}

export async function getUserBalanceBy(userId: number): Promise<UserBalance> {
  const sql = await pools.connect()
  const res = await pools.query(`
    SELECT
      user_id,
      balance,
      created_at,
      updated_at
    FROM user_balances
    WHERE user_id = $1 
  `, [userId])
  await sql.release();
  return res.rows[0]
}