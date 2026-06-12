import db from "./db.js";
const queries = [
  "ALTER TABLE users ADD COLUMN phone VARCHAR(20);",
  "ALTER TABLE applications ADD COLUMN salary_range VARCHAR(100);",
  "ALTER TABLE applications MODIFY COLUMN status ENUM('applied','seen','hr','technical','offer','rejected','ghosted','withdrawn') DEFAULT 'applied';",
];
async function executeQueries() {
  let successCount = 0;
  let failCount = 0;
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i].trim();
    if (!query) continue; // Skip empty queries
    try {
      console.log(`[${i + 1}/${queries.length}] Executing: ${query.substring(0, 80)}${query.length > 80 ? '...' : ''}`);
      const [result] = await db.execute(query);
      successCount++;
    } catch (error) {
      console.error(`✗ Error: ${error.message}\n`);
      failCount++;
    }
  }


  process.exit(failCount > 0 ? 1 : 0);
}

executeQueries();
