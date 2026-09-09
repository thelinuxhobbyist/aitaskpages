# User Data Architecture

Internal reference for how authentication, users, expert profiles, and conversations fit together on AI Jobs Market.

**Stack:** Clerk (auth) · Cloudflare D1 (application data) · Resend (email) · R2 (avatars)

---

## Principles

1. **Clerk owns authentication** — passwords, OAuth, MFA, sessions, email verification.
2. **D1 owns application data** — profiles, conversations, marketing preferences, admin exports.
3. **Clerk webhooks are the primary sync path** — `getOrCreateUser()` is a fallback only.
4. **Internal integer IDs** (`users.id`) are used for all foreign keys — not Clerk user IDs.
5. **Expert vs client vs company** is derived from the profile row — `profile_type` is `individual` (expert) or `company`. Users without a profile are clients.

---

## Data model

```
Clerk User (user_xxx)
       │
       │  clerk_user_id (unique text FK)
       ▼
   users ─────────────────────────────────────┐
     │ id (PK)                                │
     │ email, name (cached from Clerk)        │
     │ marketing_opt_in, unsubscribed         │
     │ role (freelancer | admin)              │
     │ deleted_at (soft delete / GDPR)        │
     │                                        │
     ├──1:1──► expert_profiles (optional)
     │           slug, full_name, profile_type (individual|company), bio, …
     │           status: pending|approved|hidden
     │                                        │
     └──1:N──► conversations (as client) ◄───┘
                    │
                    └──1:N──► messages
```

### `users`

Created/updated by the Clerk webhook (`user.created`, `user.updated`). Fallback insert on first sign-in if the webhook has not run.

| Field | Source | Notes |
|-------|--------|-------|
| `clerk_user_id` | Clerk | Stable link |
| `email`, `name` | Clerk (cached) | Synced on webhook + session |
| `marketing_opt_in`, `unsubscribed` | App | GDPR consent |
| `deleted_at` | App | Set on account deletion |

### `expert_profiles`

Optional. One row per expert. Linked via `user_id` → `users.id`.

- **Expert** = user with a profile row where `profile_type` is `individual`.
- **Company** = user with a profile row where `profile_type` is `company`.
- **Client / business** = user without a profile row.
- **`status`:** `approved` (public directory), `pending` (future moderation), `hidden` (account deleted).

### `conversations` + `messages`

All **signed-in** contact between clients and experts uses this system.

- `conversations.client_user_id` → `users.id`
- `conversations.freelancer_id` → `expert_profiles.id`
- One thread per client/expert pair.

### `contact_requests` (legacy)

**Deprecated.** Retained for historical rows only. Do not insert new records. Use `conversations` instead.

---

## Clerk webhook (`POST /api/webhooks/clerk`)

| Event | Action |
|-------|--------|
| `user.created` | Insert `users` row |
| `user.updated` | Update email/name; clear `deleted_at` if reactivated |
| `user.deleted` | Run GDPR deletion workflow (`processUserDeletion`) |

Verified with `CLERK_WEBHOOK_SIGNING_SECRET` via `verifyWebhook`.

### Fallback: `getOrCreateUser()`

Called on dashboard access and contact send. If no D1 row exists (webhook delayed), creates one. Does **not** replace webhook updates for existing users — only runs light session sync (`syncUserFromClerkSession`).

---

## Contact flow (current)

1. User must **sign in** and **verify email**.
2. Contact form on `/experts/[slug]` calls `startConversationEnquiry()`.
3. Creates/continues a `conversations` row and inserts the first `messages` row.
4. Resend sends **notification** emails only — replies happen on-platform.

Implementation: `src/lib/contact.ts`, `src/app/experts/[slug]/actions.ts`.

---

## GDPR & deletion

Implemented in `src/lib/user-deletion.ts`, triggered by `user.deleted` webhook.

### On account deletion

1. **`users`:** `deleted_at` set; email → `deleted-user-{id}@deleted.aijobsmarket.local`; name → `"Deleted User"`; marketing flags cleared.
2. **`expert_profiles`:** `status` → `hidden`; public fields (bio, links, image) cleared.
3. **`conversations` / `messages`:** Retained so the other party keeps their thread history. The deleted user displays as **"Deleted User"** via anonymised `users.name`.
4. **Clerk:** Account removed at source — user cannot sign in again.

### Retention policy

| Data | Retention after deletion |
|------|--------------------------|
| Anonymised `users` row | Indefinite (audit / FK integrity) |
| Conversation messages | Indefinite (legitimate interest — other party's history) |
| Marketing campaign send logs | 24 months, then review for purge |
| Clerk auth data | Removed by Clerk on account deletion |

### Lawful bases (summary)

| Processing | Basis |
|------------|-------|
| Account & messaging | Contract |
| Public expert profiles | Contract + legitimate interest |
| Marketing emails | Consent (`marketing_opt_in`) |
| Transactional email | Contract |

### Data subject requests

- **Access / portability:** Admin CSV export (`GET /api/admin/users/export`) — extend with self-service when needed.
- **Erasure:** User deletes account in Clerk → webhook triggers anonymisation.
- **Marketing opt-out:** Unsubscribe link or Dashboard → Account.

---

## What stays in Clerk only

- Passwords and OAuth tokens
- MFA / security settings
- Session management
- Email verification state
- `last_sign_in_at` (read at export time if needed; not stored in D1)

---

## Processors (sub-processors)

| Processor | Purpose |
|-----------|---------|
| [Clerk](https://clerk.com) | Authentication |
| [Cloudflare](https://cloudflare.com) | D1 database, Workers hosting, R2 storage |
| [Resend](https://resend.com) | Transactional & marketing email |
| [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) | Bot protection (optional) |

See the public [Privacy Policy](/privacy) for user-facing wording.

---

## Key files

| File | Responsibility |
|------|----------------|
| `src/app/api/webhooks/clerk/route.ts` | Webhook entrypoint |
| `src/lib/clerk-sync.ts` | Upsert / session sync |
| `src/lib/user-deletion.ts` | GDPR anonymisation |
| `src/lib/auth.ts` | `getOrCreateUser()` fallback |
| `src/lib/contact.ts` | `startConversationEnquiry()` |
| `src/lib/conversations.ts` | Threads & messages |
| `src/lib/directory.ts` | Public profile queries |
| `src/db/schema.ts` | Drizzle schema |

---

## Maintenance notes

- Do **not** store Clerk secrets or passwords in D1.
- Do **not** insert into `contact_requests` — use conversations.
- When adding new user-related tables, FK to `users.id`, not `clerk_user_id`.
- After schema changes, run `npm run db:migrate:remote` before deploy.
- If webhook and fallback both create a user, `clerk_user_id` UNIQUE constraint prevents duplicates.
