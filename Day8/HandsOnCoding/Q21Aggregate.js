import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/";

async function createRelatedCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Related_Data_test");

    // Drop existing collections
    await database.collection("users").drop().catch(err => console.log("Users collection didn't exist"));
    await database.collection("orders").drop().catch(err => console.log("Orders collection didn't exist"));

    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");

    console.log('Creating 300 users with related orders...');

    const users = [];
    const orders = [];
    const totalUsers = 300;

    // Create users
    for (let i = 1; i <= totalUsers; i++) {
      const userId = i;
      const user = {
        _id: userId,
        username: `user${userId}`,
        email: `user${userId}@example.com`,
        firstName: `User${userId}`,
        lastName: `LastName${userId}`,
        age: Math.floor(Math.random() * 40) + 18, // Age between 18-57
        city: i % 3 === 0 ? 'New York' : i % 3 === 1 ? 'London' : 'Tokyo',
        membershipTier: i % 4 === 0 ? 'Premium' : i % 4 === 1 ? 'Gold' : 'Silver',
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
        totalOrders: Math.floor(Math.random() * 10) + 1 // Each user has 1-10 orders
      };
      users.push(user);

      // Create orders for this user
      const orderCount = user.totalOrders;
      for (let j = 1; j <= orderCount; j++) {
        const orderId = orders.length + 1;
        const orderAmount = Math.floor(Math.random() * 1000) + 50; // $50-$1049
        const orderDate = new Date(user.createdAt.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000); // Within 180 days of registration

        orders.push({
          _id: orderId,
          userId: userId,
          orderNumber: `ORD-${String(orderId).padStart(6, '0')}`,
          amount: orderAmount,
          currency: 'USD',
          status: Math.random() > 0.1 ? 'completed' : 'pending', // 90% completed
          items: [
            {
              productId: Math.floor(Math.random() * 100) + 1,
              productName: `Product ${Math.floor(Math.random() * 50) + 1}`,
              quantity: Math.floor(Math.random() * 5) + 1,
              price: Math.floor(orderAmount / (Math.floor(Math.random() * 3) + 1))
            }
          ],
          shippingAddress: {
            city: user.city,
            country: user.city === 'New York' ? 'USA' : user.city === 'London' ? 'UK' : 'Japan'
          },
          orderDate: orderDate,
          createdAt: new Date()
        });
      }
    }

    // Insert users
    console.log('Inserting users...');
    await usersCollection.insertMany(users);
    console.log(`Inserted ${users.length} users`);

    // Insert orders in batches
    console.log('Inserting orders...');
    const batchSize = 100;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      await ordersCollection.insertMany(batch);
      process.stdout.write(`\rInserted ${Math.min(i + batchSize, orders.length)}/${orders.length} orders...`);
    }

    console.log('\nFinished creating related data!');

    // Display statistics
    const userCount = await usersCollection.countDocuments();
    const orderCount = await ordersCollection.countDocuments();
    const avgOrdersPerUser = orderCount / userCount;

    console.log('\n=== Data Statistics ===');
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Orders: ${orderCount}`);
    console.log(`Average Orders per User: ${avgOrdersPerUser.toFixed(2)}`);

    // Create indexes for better query performance
    console.log('\nCreating indexes...');
    await usersCollection.createIndex({ city: 1 });
    await usersCollection.createIndex({ membershipTier: 1 });
    await ordersCollection.createIndex({ userId: 1 });
    await ordersCollection.createIndex({ orderDate: -1 });
    await ordersCollection.createIndex({ status: 1 });
    console.log('Indexes created successfully!');

    // Test the relationship with a sample aggregation
    console.log('\nTesting relationship with aggregation...');
    await testRelationship(database);

  } finally {
    await client.close();
  }
}

async function testRelationship(database) {
  const usersCollection = database.collection("users");
  const ordersCollection = database.collection("orders");

  // Test 1: Basic aggregation - Users with their order counts and total spending
  console.log('\n1. Users with order statistics:');
  const userStats = await usersCollection.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "userOrders"
      }
    },
    {
      $project: {
        username: 1,
        city: 1,
        membershipTier: 1,
        orderCount: { $size: "$userOrders" },
        totalSpent: { $sum: "$userOrders.amount" },
        avgOrderValue: {
          $cond: [
            { $gt: [{ $size: "$userOrders" }, 0] },
            { $divide: [{ $sum: "$userOrders.amount" }, { $size: "$userOrders" }] },
            0
          ]
        }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 }
  ]).toArray();

  console.log('Top 5 spending users:');
  userStats.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} (${user.city}) - $${user.totalSpent} spent in ${user.orderCount} orders`);
  });

  // Test 2: Orders with user details
  console.log('\n2. Recent orders with user details:');
  const recentOrders = await ordersCollection.aggregate([
    { $sort: { orderDate: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    {
      $project: {
        orderNumber: 1,
        amount: 1,
        status: 1,
        orderDate: 1,
        userName: "$userDetails.username",
        userCity: "$userDetails.city",
        membershipTier: "$userDetails.membershipTier"
      }
    }
  ]).toArray();

  console.log('5 most recent orders:');
  recentOrders.forEach((order, index) => {
    console.log(`${index + 1}. ${order.orderNumber} - $${order.amount} by ${order.userName} (${order.userCity})`);
  });

  // Test 3: City-wise sales analysis
  console.log('\n3. Sales analysis by city:');
  const citySales = await ordersCollection.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    {
      $group: {
        _id: "$userDetails.city",
        totalSales: { $sum: "$amount" },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: "$amount" },
        uniqueCustomers: { $addToSet: "$userId" }
      }
    },
    {
      $project: {
        city: "$_id",
        totalSales: 1,
        totalOrders: 1,
        avgOrderValue: { $round: ["$avgOrderValue", 2] },
        uniqueCustomers: { $size: "$uniqueCustomers" }
      }
    },
    { $sort: { totalSales: -1 } }
  ]).toArray();

  console.log('Sales by city:');
  citySales.forEach((city, index) => {
    console.log(`${index + 1}. ${city.city}: $${city.totalSales} from ${city.totalOrders} orders (${city.uniqueCustomers} customers)`);
  });
}

// Run the script
createRelatedCollections().catch(console.error);