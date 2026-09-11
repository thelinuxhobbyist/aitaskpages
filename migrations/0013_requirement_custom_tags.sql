-- Free-text expertise and help-needed wording on tasks.
-- Structured skill/service IDs remain the matching layer.
ALTER TABLE requirements ADD COLUMN custom_skills TEXT;
ALTER TABLE requirements ADD COLUMN custom_services TEXT;
