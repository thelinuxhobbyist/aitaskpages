-- Public requirement fields: anonymous business category and remote flag.

ALTER TABLE requirements ADD COLUMN business_type TEXT NOT NULL DEFAULT 'sme';
ALTER TABLE requirements ADD COLUMN remote_ok INTEGER NOT NULL DEFAULT 0;
