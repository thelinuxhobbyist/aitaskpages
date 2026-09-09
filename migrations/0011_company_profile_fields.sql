-- Company-specific profile details and extra outbound links.
ALTER TABLE freelancer_profiles ADD COLUMN company_size TEXT;
ALTER TABLE freelancer_profiles ADD COLUMN year_established INTEGER;
ALTER TABLE freelancer_profiles ADD COLUMN external_links TEXT;
