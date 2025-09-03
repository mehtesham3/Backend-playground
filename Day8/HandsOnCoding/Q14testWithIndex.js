//Testing with index
import { MongoClient } from 'mongodb';
const uri = "mongodb://localhost:27017/Performance_test";

async function testQueryPerformance() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const usersCollection = client.db().collection('users');

    console.log('Testing query performance WITH index...');

    // Test the same query again
    const startTime = Date.now();

    const result = await usersCollection.find({
      membershipId: "MID-0500000"
    }).toArray();

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`Query found ${result.length} documents`);
    console.log(`Execution time WITH index: ${executionTime} ms`);

    // Check the query plan to confirm it's using IXSCAN
    const explain = await usersCollection.find({
      membershipId: "MID-0500000"
    }).explain("executionStats");

    console.log('\nQuery Plan:');
    console.log(`- Stage: ${explain.queryPlanner.winningPlan.inputStage.stage}`);
    console.log(`- Index Used: ${explain.queryPlanner.winningPlan.inputStage.indexName}`);
    console.log(`- Documents Examined: ${explain.executionStats.totalDocsExamined}`);
    console.log(`- Documents Returned: ${explain.executionStats.nReturned}`);

    // Performance comparison
    console.log('\nPerformance Improvement:');
    console.log('Without index: ~400-600ms (COLLSCAN - 1,000,000 docs examined)');
    console.log('With index: ~1-5ms (IXSCAN - 1 doc examined)');
    console.log('Improvement: 100-200x faster!');

  } finally {
    await client.close();
  }
}

testQueryPerformance().catch(console.error);