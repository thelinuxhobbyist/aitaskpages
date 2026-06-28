-- Reserve a subscription tier for future paid plans. Everyone is on "free" today.
ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
