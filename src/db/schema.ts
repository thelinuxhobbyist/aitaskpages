import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull(),
    role: text("role", { enum: ["freelancer", "admin"] })
      .notNull()
      .default("freelancer"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("users_clerk_user_id_idx").on(table.clerkUserId)]
);

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(freelancerProfiles, {
    fields: [users.id],
    references: [freelancerProfiles.userId],
  }),
}));

// ─── Freelancer Profiles ─────────────────────────────────────────────────────

export const freelancerProfiles = sqliteTable(
  "freelancer_profiles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    fullName: text("full_name").notNull(),
    headline: text("headline"),
    bio: text("bio"),
    location: text("location"),
    hourlyRate: integer("hourly_rate"),
    availability: text("availability"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    websiteUrl: text("website_url"),
    profileImageUrl: text("profile_image_url"),
    profileViews: integer("profile_views").notNull().default(0),
    /** Reserved for future monetisation — not used in MVP */
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("freelancer_profiles_slug_idx").on(table.slug),
    index("freelancer_profiles_featured_idx").on(table.featured),
    index("freelancer_profiles_location_idx").on(table.location),
  ]
);

export const freelancerProfilesRelations = relations(
  freelancerProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [freelancerProfiles.userId],
      references: [users.id],
    }),
    skills: many(freelancerSkills),
    services: many(freelancerServices),
    contactRequests: many(contactRequests),
  })
);

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills = sqliteTable(
  "skills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
  },
  (table) => [index("skills_slug_idx").on(table.slug)]
);

export const skillsRelations = relations(skills, ({ many }) => ({
  freelancers: many(freelancerSkills),
}));

// ─── Freelancer ↔ Skills (join) ──────────────────────────────────────────────

export const freelancerSkills = sqliteTable(
  "freelancer_skills",
  {
    freelancerId: integer("freelancer_id")
      .notNull()
      .references(() => freelancerProfiles.id, { onDelete: "cascade" }),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.freelancerId, table.skillId] }),
    index("freelancer_skills_skill_id_idx").on(table.skillId),
  ]
);

export const freelancerSkillsRelations = relations(
  freelancerSkills,
  ({ one }) => ({
    freelancer: one(freelancerProfiles, {
      fields: [freelancerSkills.freelancerId],
      references: [freelancerProfiles.id],
    }),
    skill: one(skills, {
      fields: [freelancerSkills.skillId],
      references: [skills.id],
    }),
  })
);

// ─── Services ────────────────────────────────────────────────────────────────

export const services = sqliteTable(
  "services",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
  },
  (table) => [index("services_slug_idx").on(table.slug)]
);

export const servicesRelations = relations(services, ({ many }) => ({
  freelancers: many(freelancerServices),
}));

// ─── Freelancer ↔ Services (join) ────────────────────────────────────────────

export const freelancerServices = sqliteTable(
  "freelancer_services",
  {
    freelancerId: integer("freelancer_id")
      .notNull()
      .references(() => freelancerProfiles.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.freelancerId, table.serviceId] }),
    index("freelancer_services_service_id_idx").on(table.serviceId),
  ]
);

export const freelancerServicesRelations = relations(
  freelancerServices,
  ({ one }) => ({
    freelancer: one(freelancerProfiles, {
      fields: [freelancerServices.freelancerId],
      references: [freelancerProfiles.id],
    }),
    service: one(services, {
      fields: [freelancerServices.serviceId],
      references: [services.id],
    }),
  })
);

// ─── Contact Requests ────────────────────────────────────────────────────────

export const contactRequests = sqliteTable(
  "contact_requests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    freelancerId: integer("freelancer_id")
      .notNull()
      .references(() => freelancerProfiles.id, { onDelete: "cascade" }),
    senderName: text("sender_name").notNull(),
    senderEmail: text("sender_email").notNull(),
    companyName: text("company_name"),
    budget: text("budget"),
    message: text("message").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("contact_requests_freelancer_id_idx").on(table.freelancerId),
    index("contact_requests_created_at_idx").on(table.createdAt),
  ]
);

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
  freelancer: one(freelancerProfiles, {
    fields: [contactRequests.freelancerId],
    references: [freelancerProfiles.id],
  }),
}));

// ─── Type exports ────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type FreelancerProfile = typeof freelancerProfiles.$inferSelect;
export type NewFreelancerProfile = typeof freelancerProfiles.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type NewContactRequest = typeof contactRequests.$inferInsert;
