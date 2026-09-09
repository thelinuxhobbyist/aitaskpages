-- Individual vs company directory listings. Existing rows are individuals.
ALTER TABLE freelancer_profiles ADD COLUMN profile_type TEXT NOT NULL DEFAULT 'individual';
CREATE INDEX IF NOT EXISTS freelancer_profiles_profile_type_idx ON freelancer_profiles (profile_type);
