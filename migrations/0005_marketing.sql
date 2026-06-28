-- Marketing email preferences on users
ALTER TABLE users ADD COLUMN marketing_opt_in INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN unsubscribed INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN updated_at TEXT;
--> statement-breakpoint
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN deleted_at TEXT;
--> statement-breakpoint
CREATE INDEX users_marketing_idx ON users (marketing_opt_in, unsubscribed);
--> statement-breakpoint
-- Campaign send logs
CREATE TABLE marketing_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_body TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_by TEXT
);
--> statement-breakpoint
CREATE TABLE marketing_campaign_sends (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  campaign_id INTEGER NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX marketing_campaign_sends_campaign_id_idx ON marketing_campaign_sends (campaign_id);
