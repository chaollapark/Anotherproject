const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  if (!client.isConnected) await client.connect();
  return client.db(); // e.g., db.collection('users')
}

module.exports = connectDB;