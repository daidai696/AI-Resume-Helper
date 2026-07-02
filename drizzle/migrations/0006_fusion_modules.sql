-- Fusion modules: Job tracker, Offers, Comments

CREATE TABLE `job_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`resume_id` text,
	`job_title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`job_url` text,
	`jd` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`stage` text,
	`applied_at` integer,
	`salary` integer,
	`currency` text DEFAULT 'CNY' NOT NULL,
	`notes` text,
	`next_action` text,
	`reminder_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`application_id` text,
	`company` text NOT NULL,
	`position` text NOT NULL,
	`base_salary` integer NOT NULL,
	`bonus` integer DEFAULT 0,
	`stock` integer DEFAULT 0,
	`benefits` text DEFAULT '[]',
	`start_date` text,
	`deadline` text,
	`location` text,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`application_id`) REFERENCES `job_applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resume_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`content` text NOT NULL,
	`section_type` text,
	`item_index` integer,
	`parent_id` text,
	`is_resolved` integer DEFAULT false NOT NULL,
	`suggestion` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
