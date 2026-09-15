-- Experts can list an indicative hourly rate in their own currency.
ALTER TABLE freelancer_profiles ADD COLUMN hourly_rate_currency TEXT DEFAULT 'GBP';
