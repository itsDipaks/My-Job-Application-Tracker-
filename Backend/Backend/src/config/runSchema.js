import db from "./db.js";
const schema = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  is_verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW()
);
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  platform ENUM('linkedin','naukri','email','direct','other') NOT NULL,
  status ENUM('applied','seen','hr','technical','offer','rejected','ghosted') DEFAULT 'applied',
  job_url VARCHAR(500),
  jd_text TEXT,
  notes TEXT,
  applied_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS emails (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  application_id VARCHAR(36),
  raw_body TEXT NOT NULL,
  parsed_json JSON,
  from_address VARCHAR(255),
  subject VARCHAR(500),
  received_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS follow_ups (
  id VARCHAR(36) PRIMARY KEY,
  application_id VARCHAR(36) NOT NULL,
  body TEXT NOT NULL,
  type ENUM('followup','thankyou','withdraw') DEFAULT 'followup',
  sent_at DATETIME,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS status_history (
  id VARCHAR(36) PRIMARY KEY,
  application_id VARCHAR(36) NOT NULL,
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  changed_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
`
const tables = schema.split(";").filter((t) => t.trim());
for (const table of tables) {
  await db.execute(table)
}
console.log("All tables created successfully")
process.exit(0)