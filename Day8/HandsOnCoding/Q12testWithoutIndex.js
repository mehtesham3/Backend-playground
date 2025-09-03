//Testing without creating index
import { MongoClient } from 'mongodb';
const uri = "mongodb://localhost:27017/Performance_test";

async function testQueryPerformance() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const usersCollection = client.db().collection('users');

    console.log('Testing query performance WITHOUT index...');

    // Test a query that will be slow without an index
    const startTime = Date.now();

    const result = await usersCollection.find({
      membershipId: "MID-0500000"
    }).toArray();

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`Query found ${result.length} documents`);
    console.log(`Execution time WITHOUT index: ${executionTime} ms`);
    console.log('Document:', result[0]);

    // Check the query plan to confirm it's doing a COLLSCAN
    const explain = await usersCollection.find({
      membershipId: "MID-0500000"
    }).explain("executionStats");

    console.log('\nQuery Plan:');
    console.log(`- Stage: ${explain.queryPlanner.winningPlan.inputStage.stage}`);
    console.log(`- Documents Examined: ${explain.executionStats.totalDocsExamined}`);
    console.log(`- Documents Returned: ${explain.executionStats.nReturned}`);

  } finally {
    await client.close();
  }
}

testQueryPerformance().catch(console.error);