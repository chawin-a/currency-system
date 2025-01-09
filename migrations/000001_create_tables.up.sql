CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE transaction_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAIL'
);

CREATE TABLE transactions (
    transaction_id      SERIAL PRIMARY KEY,
    transaction_status  transaction_status NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transaction_entries (
    entry_id                    SERIAL PRIMARY KEY,
    transaction_id              INT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    user_id                     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount                      NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    is_debit                    BOOLEAN NOT NULL,
    transaction_entry_status    transaction_status NOT NULL DEFAULT 'PENDING',
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_balances (
    user_id         INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    current_balance NUMERIC(18, 2) NOT NULL DEFAULT 0,
    lock_version    INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);