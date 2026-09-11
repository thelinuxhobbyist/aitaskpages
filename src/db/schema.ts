import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull(),
    /** Display name, synced from Clerk. Used for client identity in conversations. */
    name: text("name"),
    role: text("role", { enum: ["freelancer", "admin"] })
      .notNull()
      .default("freelancer"),
    /** Subscription tier. Everyone is "free" today; reserved for future paid plans. */
    plan: text("plan", { enum: ["free", "pro"] })
      .notNull()
      .default("free"),
    /** Explicit opt-in to product updates / marketing emails. */
    marketingOptIn: integer("marketing_opt_in", { mode: "boolean" })
      .notNull()
      .default(false),
    /** Set via unsubscribe link — blocks marketing only, not transactional mail. */
    unsubscribed: integer("unsubscribed", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    /** Soft-delete when Clerk account is removed. */
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("users_clerk_user_id_idx").on(table.clerkUserId),
    index("users_marketing_idx").on(table.marketingOptIn, table.unsubscribed),
  ]
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(expertProfiles, {
    fields: [users.id],
    references: [expertProfiles.userId],
  }),
  conversationsAsClient: many(conversations),
  requirements: many(requirements),
}));

// ─── Expert Profiles ─────────────────────────────────────────────────────────
// NOTE: the physical table/column names remain "freelancer_*" to avoid a
// production data migration. Only the code-level identifiers use "expert".

export const expertProfiles = sqliteTable(
  "freelancer_profiles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    fullName: text("full_name").notNull(),
    /** Individual expert vs company/team listing. */
    profileType: text("profile_type", { enum: ["individual", "company"] })
      .notNull()
      .default("individual"),
    headline: text("headline"),
    bio: text("bio"),
    location: text("location"),
    hourlyRate: integer("hourly_rate"),
    availability: text("availability"),
    companySize: text("company_size"),
    yearEstablished: integer("year_established"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    websiteUrl: text("website_url"),
    externalLinks: text("external_links"),
    profileImageUrl: text("profile_image_url"),
    profileViews: integer("profile_views").notNull().default(0),
    /** Public directory visibility — hidden when the account is deleted. */
    status: text("status", { enum: ["pending", "approved", "hidden"] })
      .notNull()
      .default("approved"),
    /** Reserved for future monetisation — not used in MVP */
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    /** JSON array of skill names not in the global skills catalog */
    customSkills: text("custom_skills"),
    /** JSON array of service names not in the global services catalog */
    customServices: text("custom_services"),
    /**
     * JSON array of { title, description?, url } pointing to external work.
     * AI Task Pages does not host any of this content.
     */
    workExamples: text("work_examples"),
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
    index("freelancer_profiles_status_idx").on(table.status),
    index("freelancer_profiles_profile_type_idx").on(table.profileType),
  ]
);

export const expertProfilesRelations = relations(
  expertProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [expertProfiles.userId],
      references: [users.id],
    }),
    skills: many(expertSkills),
    services: many(expertServices),
    contactRequests: many(contactRequests),
    conversations: many(conversations),
    requirementInterests: many(requirementInterests),
    requirementNotifications: many(requirementNotifications),
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
  experts: many(expertSkills),
  requirements: many(requirementSkills),
}));

// ─── Expert ↔ Skills (join) ──────────────────────────────────────────────────

export const expertSkills = sqliteTable(
  "freelancer_skills",
  {
    expertId: integer("freelancer_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.expertId, table.skillId] }),
    index("freelancer_skills_skill_id_idx").on(table.skillId),
  ]
);

export const expertSkillsRelations = relations(
  expertSkills,
  ({ one }) => ({
    expert: one(expertProfiles, {
      fields: [expertSkills.expertId],
      references: [expertProfiles.id],
    }),
    skill: one(skills, {
      fields: [expertSkills.skillId],
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
  experts: many(expertServices),
  requirements: many(requirementServices),
}));

// ─── Expert ↔ Services (join) ────────────────────────────────────────────────

export const expertServices = sqliteTable(
  "freelancer_services",
  {
    expertId: integer("freelancer_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.expertId, table.serviceId] }),
    index("freelancer_services_service_id_idx").on(table.serviceId),
  ]
);

export const expertServicesRelations = relations(
  expertServices,
  ({ one }) => ({
    expert: one(expertProfiles, {
      fields: [expertServices.expertId],
      references: [expertProfiles.id],
    }),
    service: one(services, {
      fields: [expertServices.serviceId],
      references: [services.id],
    }),
  })
);

// ─── Contact Requests (legacy) ───────────────────────────────────────────────
// Deprecated: signed-in contact now uses conversations + messages. This table
// is retained for historical rows only — do not insert new records.

export const contactRequests = sqliteTable(
  "contact_requests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    expertId: integer("freelancer_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    senderName: text("sender_name").notNull(),
    senderEmail: text("sender_email").notNull(),
    companyName: text("company_name"),
    budget: text("budget"),
    message: text("message").notNull(),
    readAt: text("read_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("contact_requests_freelancer_id_idx").on(table.expertId),
    index("contact_requests_created_at_idx").on(table.createdAt),
  ]
);

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
  expert: one(expertProfiles, {
    fields: [contactRequests.expertId],
    references: [expertProfiles.id],
  }),
}));

// ─── Conversations ───────────────────────────────────────────────────────────
// On-platform messaging between a client (user) and an expert. One thread per
// client/expert pair. AI Task Pages provides the communication channel only —
// it is not party to any agreement between users.

export const conversations = sqliteTable(
  "conversations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    expertId: integer("freelancer_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    clientUserId: integer("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: text("company_name"),
    budget: text("budget"),
    /** When each side last opened the thread (drives unread state). */
    clientLastReadAt: text("client_last_read_at"),
    expertLastReadAt: text("expert_last_read_at"),
    lastMessageAt: text("last_message_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("conversations_freelancer_id_idx").on(table.expertId),
    index("conversations_client_user_id_idx").on(table.clientUserId),
    uniqueIndex("conversations_pair_idx").on(
      table.expertId,
      table.clientUserId
    ),
    index("conversations_last_message_at_idx").on(table.lastMessageAt),
  ]
);

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    expert: one(expertProfiles, {
      fields: [conversations.expertId],
      references: [expertProfiles.id],
    }),
    client: one(users, {
      fields: [conversations.clientUserId],
      references: [users.id],
    }),
    messages: many(messages),
  })
);

// ─── Messages ────────────────────────────────────────────────────────────────

export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderRole: text("sender_role", { enum: ["client", "expert"] }).notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
    index("messages_created_at_idx").on(table.createdAt),
  ]
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// ─── Requirements (business opportunity matching) ─────────────────────────────

export const requirements = sqliteTable(
  "requirements",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clientUserId: integer("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
/** Company name shown on public task listings. Personal contact details stay private. */
    companyName: text("company_name"),
    /** Legacy category — superseded by company_name on public pages. */
    businessType: text("business_type", {
      enum: [
        "dental_practice",
        "manufacturing",
        "law_firm",
        "startup",
        "sme",
        "enterprise",
        "healthcare",
        "retail",
        "financial_services",
        "other",
      ],
    })
      .notNull()
      .default("sme"),
    budget: text("budget"),
    location: text("location"),
    remoteOk: integer("remote_ok", { mode: "boolean" })
      .notNull()
      .default(false),
    /** JSON array of expertise terms the client typed (may include custom wording). */
    customSkills: text("custom_skills"),
    /** JSON array of help-needed terms the client typed (may include custom wording). */
    customServices: text("custom_services"),
    status: text("status", {
      enum: ["draft", "open", "closed", "filled"],
    })
      .notNull()
      .default("draft"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("requirements_client_user_id_idx").on(table.clientUserId),
    index("requirements_status_idx").on(table.status),
    index("requirements_created_at_idx").on(table.createdAt),
  ]
);

export const requirementsRelations = relations(
  requirements,
  ({ one, many }) => ({
    client: one(users, {
      fields: [requirements.clientUserId],
      references: [users.id],
    }),
    skills: many(requirementSkills),
    services: many(requirementServices),
    interests: many(requirementInterests),
    notifications: many(requirementNotifications),
  })
);

export const requirementSkills = sqliteTable(
  "requirement_skills",
  {
    requirementId: integer("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.requirementId, table.skillId] }),
    index("requirement_skills_skill_id_idx").on(table.skillId),
  ]
);

export const requirementSkillsRelations = relations(
  requirementSkills,
  ({ one }) => ({
    requirement: one(requirements, {
      fields: [requirementSkills.requirementId],
      references: [requirements.id],
    }),
    skill: one(skills, {
      fields: [requirementSkills.skillId],
      references: [skills.id],
    }),
  })
);

export const requirementServices = sqliteTable(
  "requirement_services",
  {
    requirementId: integer("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.requirementId, table.serviceId] }),
    index("requirement_services_service_id_idx").on(table.serviceId),
  ]
);

export const requirementServicesRelations = relations(
  requirementServices,
  ({ one }) => ({
    requirement: one(requirements, {
      fields: [requirementServices.requirementId],
      references: [requirements.id],
    }),
    service: one(services, {
      fields: [requirementServices.serviceId],
      references: [services.id],
    }),
  })
);

export const requirementInterests = sqliteTable(
  "requirement_interests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    requirementId: integer("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    expertId: integer("expert_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    message: text("message"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("requirement_interests_pair_idx").on(
      table.requirementId,
      table.expertId
    ),
    index("requirement_interests_expert_id_idx").on(table.expertId),
  ]
);

export const requirementInterestsRelations = relations(
  requirementInterests,
  ({ one }) => ({
    requirement: one(requirements, {
      fields: [requirementInterests.requirementId],
      references: [requirements.id],
    }),
    expert: one(expertProfiles, {
      fields: [requirementInterests.expertId],
      references: [expertProfiles.id],
    }),
  })
);

export const requirementNotifications = sqliteTable(
  "requirement_notifications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    requirementId: integer("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    expertId: integer("expert_id")
      .notNull()
      .references(() => expertProfiles.id, { onDelete: "cascade" }),
    sentAt: text("sent_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("requirement_notifications_pair_idx").on(
      table.requirementId,
      table.expertId
    ),
  ]
);

export const requirementNotificationsRelations = relations(
  requirementNotifications,
  ({ one }) => ({
    requirement: one(requirements, {
      fields: [requirementNotifications.requirementId],
      references: [requirements.id],
    }),
    expert: one(expertProfiles, {
      fields: [requirementNotifications.expertId],
      references: [expertProfiles.id],
    }),
  })
);

// ─── Marketing campaigns ─────────────────────────────────────────────────────

export const marketingCampaigns = sqliteTable("marketing_campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subject: text("subject").notNull(),
  previewText: text("preview_text"),
  htmlBody: text("html_body").notNull(),
  sentAt: text("sent_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  totalRecipients: integer("total_recipients").notNull().default(0),
  sentCount: integer("sent_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  createdBy: text("created_by"),
});

export const marketingCampaignSends = sqliteTable(
  "marketing_campaign_sends",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    campaignId: integer("campaign_id")
      .notNull()
      .references(() => marketingCampaigns.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull(),
    email: text("email").notNull(),
    status: text("status", { enum: ["sent", "failed"] }).notNull(),
    errorMessage: text("error_message"),
    sentAt: text("sent_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("marketing_campaign_sends_campaign_id_idx").on(table.campaignId),
  ]
);

export const marketingCampaignsRelations = relations(
  marketingCampaigns,
  ({ many }) => ({
    sends: many(marketingCampaignSends),
  })
);

export const marketingCampaignSendsRelations = relations(
  marketingCampaignSends,
  ({ one }) => ({
    campaign: one(marketingCampaigns, {
      fields: [marketingCampaignSends.campaignId],
      references: [marketingCampaigns.id],
    }),
  })
);

// ─── Type exports ────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ExpertProfile = typeof expertProfiles.$inferSelect;
export type NewExpertProfile = typeof expertProfiles.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type NewContactRequest = typeof contactRequests.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type MessageRole = Message["senderRole"];

export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type MarketingCampaignSend = typeof marketingCampaignSends.$inferSelect;

export type Requirement = typeof requirements.$inferSelect;
export type NewRequirement = typeof requirements.$inferInsert;
export type RequirementInterest = typeof requirementInterests.$inferSelect;
export type RequirementStatus = Requirement["status"];
