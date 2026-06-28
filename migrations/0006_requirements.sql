-- Business requirements and expert opportunity matching.

CREATE TABLE requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT,
  budget TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX requirements_client_user_id_idx ON requirements(client_user_id);
CREATE INDEX requirements_status_idx ON requirements(status);
CREATE INDEX requirements_created_at_idx ON requirements(created_at);

CREATE TABLE requirement_skills (
  requirement_id INTEGER NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (requirement_id, skill_id)
);

CREATE INDEX requirement_skills_skill_id_idx ON requirement_skills(skill_id);

CREATE TABLE requirement_services (
  requirement_id INTEGER NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (requirement_id, service_id)
);

CREATE INDEX requirement_services_service_id_idx ON requirement_services(service_id);

CREATE TABLE requirement_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_id INTEGER NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  expert_id INTEGER NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX requirement_interests_pair_idx ON requirement_interests(requirement_id, expert_id);
CREATE INDEX requirement_interests_expert_id_idx ON requirement_interests(expert_id);

CREATE TABLE requirement_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requirement_id INTEGER NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  expert_id INTEGER NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX requirement_notifications_pair_idx ON requirement_notifications(requirement_id, expert_id);
