CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_user_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'freelancer' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_user_id_unique` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE INDEX `users_clerk_user_id_idx` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE TABLE `freelancer_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`slug` text NOT NULL,
	`full_name` text NOT NULL,
	`headline` text,
	`bio` text,
	`location` text,
	`hourly_rate` integer,
	`availability` text,
	`linkedin_url` text,
	`github_url` text,
	`website_url` text,
	`profile_image_url` text,
	`profile_views` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `freelancer_profiles_user_id_unique` ON `freelancer_profiles` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `freelancer_profiles_slug_unique` ON `freelancer_profiles` (`slug`);--> statement-breakpoint
CREATE INDEX `freelancer_profiles_slug_idx` ON `freelancer_profiles` (`slug`);--> statement-breakpoint
CREATE INDEX `freelancer_profiles_featured_idx` ON `freelancer_profiles` (`featured`);--> statement-breakpoint
CREATE INDEX `freelancer_profiles_location_idx` ON `freelancer_profiles` (`location`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skills_name_unique` ON `skills` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `skills_slug_unique` ON `skills` (`slug`);--> statement-breakpoint
CREATE INDEX `skills_slug_idx` ON `skills` (`slug`);--> statement-breakpoint
CREATE TABLE `freelancer_skills` (
	`freelancer_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	PRIMARY KEY(`freelancer_id`, `skill_id`),
	FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `freelancer_skills_skill_id_idx` ON `freelancer_skills` (`skill_id`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_name_unique` ON `services` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `services_slug_idx` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `freelancer_services` (
	`freelancer_id` integer NOT NULL,
	`service_id` integer NOT NULL,
	PRIMARY KEY(`freelancer_id`, `service_id`),
	FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `freelancer_services_service_id_idx` ON `freelancer_services` (`service_id`);--> statement-breakpoint
CREATE TABLE `contact_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`freelancer_id` integer NOT NULL,
	`sender_name` text NOT NULL,
	`sender_email` text NOT NULL,
	`company_name` text,
	`budget` text,
	`message` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`freelancer_id`) REFERENCES `freelancer_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `contact_requests_freelancer_id_idx` ON `contact_requests` (`freelancer_id`);--> statement-breakpoint
CREATE INDEX `contact_requests_created_at_idx` ON `contact_requests` (`created_at`);
