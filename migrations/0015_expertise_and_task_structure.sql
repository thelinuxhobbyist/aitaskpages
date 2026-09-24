-- Structured commercial profile and task fields.
-- Existing skills, services, bio, and work examples are unchanged.

ALTER TABLE freelancer_profiles ADD COLUMN industries TEXT;
ALTER TABLE freelancer_profiles ADD COLUMN help_with TEXT;

ALTER TABLE requirements ADD COLUMN industry TEXT;
ALTER TABLE requirements ADD COLUMN problem TEXT;
ALTER TABLE requirements ADD COLUMN timeline TEXT;
ALTER TABLE requirements ADD COLUMN technologies TEXT;
