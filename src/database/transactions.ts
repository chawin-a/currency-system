import pools from './db'
import { User } from './users'
import { logger } from '../logger'

export interface Transaction {
  transaction_id: number
  transaction_status: string
  created_at: string
  updated_at: string
}

export interface TransactionEntry {
  entry_id: number
  transaction_id: number
  user_id: number
  amount: number
  is_debit: boolean
  transaction_entry_status: string
  created_at: string
  updated_at: string
}

export async function createTransaction(sender: User, recipient: User, amount: number): Promise<Transaction> {
  const sql = await pools.connect()
  let res = await sql.query(`
    INSERT INTO transactions ("transaction_status") VALUES ('PENDING'::transaction_status)
    RETURNING transaction_id, transaction_status, created_at, updated_at
  `)
  const transaction = res.rows[0] as Transaction
  const queryTransactionEntry = `
      INSERT INTO transaction_entries ("transaction_id", "user_id", "amount", "is_debit") 
      VALUES ($1, $2, $3, $4)
      RETURNING 
        entry_id,
        transaction_id,
        user_id,
        amount,
        is_debit,
        transaction_entry_status,
        created_at,
        updated_at
  `
  await Promise.all([
    sql.query(queryTransactionEntry, [transaction.transaction_id, sender.user_id, amount, false]),
    sql.query(queryTransactionEntry, [transaction.transaction_id, recipient.user_id, amount, true])
  ])

  let isSuccess = false
  try {
    await sql.query("BEGIN")

    const updateQueryCredit = `
      UPDATE user_balances
      SET balance = balance - $1, "version" = "version" + 1, updated_at = NOW()
      WHERE user_id = $2 AND "version" = (SELECT "version" FROM user_balances WHERE user_id = $2)
      RETURNING balance
    `;
    let res = await sql.query(updateQueryCredit, [amount, sender.user_id]);
    if (res.rowCount != 1) {
      throw new Error("conflict version during update")
    }
    const newBalance = res.rows[0].balance
    if (newBalance < 0) {
      throw new Error("balance is not enough")
    }

    const updateQueryDebit = `
      UPDATE user_balances
      SET balance = balance + $1, "version" = "version" + 1, updated_at = NOW()
      WHERE user_id = $2 AND "version" = (SELECT "version" FROM user_balances WHERE user_id = $2)
      RETURNING balance
    `;
    res = await sql.query(updateQueryDebit, [amount, recipient.user_id]);
    if (res.rowCount != 1) {
      throw new Error("conflict version during update")
    }

    await sql.query("COMMIT")
    isSuccess = true
  } catch (err) {
    try {
      await sql.query('ROLLBACK');
    } catch (rollbackError) {
      logger.error('Error rolling back transaction:', { rollbackError });
    }
    logger.error('Transaction error', { err });
  }

  const status = isSuccess ? "SUCCESS" : "FAIL"
  await sql.query(`
    UPDATE transaction_entries SET transaction_entry_status = $1, updated_at = NOW() WHERE transaction_id = $2
  `, [status, transaction.transaction_id])
  res = await sql.query(`
    UPDATE transactions SET transaction_status = $1, updated_at = NOW() WHERE transaction_id = $2
    RETURNING transaction_id, transaction_status, created_at, updated_at
  `, [status, transaction.transaction_id])
  await sql.release()
  return res.rows[0] as Transaction
}

export async function listUserTransactions(id: number, page: number, limit: number): Promise<TransactionEntry[]> {
  const sql = await pools.connect()
  const res = await pools.query(`
    SELECT
      entry_id,
      transaction_id,
      user_id,
      amount,
      is_debit,
      transaction_entry_status,
      created_at,
      updated_at
    FROM transaction_entries
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `, [id, limit, (page - 1) * limit])
  await sql.release();
  return res.rows as TransactionEntry[]
}