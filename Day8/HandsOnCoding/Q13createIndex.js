// Creating index

import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017/Performance_test";

async function createIndex() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const usersCollection = client.db().collection('users');

    console.log('Creating index on membershipId field...');

    const startTime = Date.now();
    await usersCollection.createIndex({ membershipId: 1 });
    const endTime = Date.now();

    console.log(`Index created in ${endTime - startTime} ms`);

    // List indexes to verify
    const indexes = await usersCollection.indexes();
    console.log('\nCurrent indexes:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });

  } finally {
    await client.close();
  }
}

createIndex().catch(console.error);