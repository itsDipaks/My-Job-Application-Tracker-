import db from "./db.js";

const queries = [

  "ALTER TABLE users ADD COLUMN phone VARCHAR(20);",
  "ALTER TABLE applications ADD COLUMN salary_range VARCHAR(100);",
  "ALTER TABLE applications MODIFY COLUMN status ENUM('applied','seen','hr','technical','offer','rejected','ghosted','withdrawn') DEFAULT 'applied';",
];

async function executeQueries() {
  console.log(`Starting execution of ${queries.length} queries...\n`);
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i].trim();
    
    if (!query) continue; // Skip empty queries
    
    try {
      console.log(`[${i + 1}/${queries.length}] Executing: ${query.substring(0, 80)}${query.length > 80 ? '...' : ''}`);
      const [result] = await db.execute(query);
      console.log(`✓ Success\n`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error: ${error.message}\n`);
      failCount++;
      // Continue with next query even if this one fails
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Execution Summary:`);
  console.log(`Total queries: ${queries.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log("=".repeat(50));
  
  process.exit(failCount > 0 ? 1 : 0);
}

executeQueries();
