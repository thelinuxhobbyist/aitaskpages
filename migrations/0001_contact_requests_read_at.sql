-- Add read/unread tracking to contact enquiries for the dashboard inbox.
ALTER TABLE contact_requests ADD COLUMN read_at TEXT;
