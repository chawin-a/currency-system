-- Up Migration

CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE transaction_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAIL'
);

CREATE TABLE transactions (
    transaction_id      SERIAL PRIMARY KEY,
    transaction_status  transaction_status NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transaction_created_at ON transactions(created_at DESC);

CREATE TABLE transaction_entries (
    entry_id                    SERIAL PRIMARY KEY,
    transaction_id              INT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    user_id                     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount                      NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    is_debit                    BOOLEAN NOT NULL,
    transaction_entry_status    transaction_status NOT NULL DEFAULT 'PENDING',
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transaction_entry_created_at ON transaction_entries(created_at DESC);

CREATE TABLE user_balances (
    user_id         INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    balance         NUMERIC(18, 2) NOT NULL DEFAULT 0,
    "version"       INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (username) 
VALUES 
    ('user1'),
    ('user2'),
    ('user3'),
    ('user4'),
    ('user5');
INSERT INTO user_balances (user_id, balance)
SELECT user_id, '10000' FROM users;

-- Down Migration

DROP TABLE IF EXISTS user_balances;
DROP INDEX IF EXISTS idx_transaction_entry_created_at;
DROP TABLE IF EXISTS transaction_entries;
DROP INDEX IF EXISTS idx_transaction_created_at;
DROP TABLE IF EXISTS transactions;
DROP TYPE transaction_status;
DROP TABLE IF EXISTS users;