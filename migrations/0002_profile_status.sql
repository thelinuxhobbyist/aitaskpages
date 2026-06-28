-- Expert profiles now require admin approval before they are public.
-- New profiles default to 'pending'; existing profiles are grandfathered to 'approved'.
ALTER TABLE freelancer_profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
UPDATE freelancer_profiles SET status = 'approved';
CREATE INDEX IF NOT EXISTS freelancer_profiles_status_idx ON freelancer_profiles (status);
