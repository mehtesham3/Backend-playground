//Create an indexed field and test query performance
//Creating 1 crore/million records
//1st do this
import { MongoClient } from "mongodb"

const uri = "mongodb://localhost:27017/";

async function insertLargeData() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = client.db("Performance_test");
    const userCollection = dbName.collection("users");

    await userCollection.drop().catch(err => console.log("Collection didn't exist, creating new one."));
    console.log('Inserting 1,000,000 user documents... This will take a moment.');

    const batchSize = 1000;
    const totalDocument = 1000000;
    let document = [];

    for (let i = 1; i <= totalDocument; i++) {
      document.push({
        username: `user${i}`,
        email: `user${i}@example.com`,
        age: Math.floor(Math.random() * 50) + 18, // Random age between 18-67
        city: i % 2 === 0 ? 'New York' : 'London',
        createdAt: new Date(),
        // Add some indexed field we'll search on
        membershipId: `MID-${String(i).padStart(7, '0')}`
      });
      if (document.length === batchSize || i === totalDocument) {
        await userCollection.insertMany(document);
        process.stdout.write(`\rInserted ${i} documents...`);
        document = [];
      }
    }
    console.log('\nFinished inserting documents!');
    console.log('Document count:', await userCollection.countDocuments());
  } finally {
    await client.close();
  }
}

insertLargeData().catch(console.error);
