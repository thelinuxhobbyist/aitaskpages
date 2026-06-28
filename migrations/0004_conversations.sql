-- On-platform messaging: conversations between clients and experts.

ALTER TABLE users ADD COLUMN name TEXT;

CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  freelancer_id INTEGER NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  client_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  budget TEXT,
  client_last_read_at TEXT,
  expert_last_read_at TEXT,
  last_message_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX conversations_freelancer_id_idx ON conversations(freelancer_id);
CREATE INDEX conversations_client_user_id_idx ON conversations(client_user_id);
CREATE UNIQUE INDEX conversations_pair_idx ON conversations(freelancer_id, client_user_id);
CREATE INDEX conversations_last_message_at_idx ON conversations(last_message_at);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);
