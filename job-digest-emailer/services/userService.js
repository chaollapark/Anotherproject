const connectDB = require('../utils/db');

class UserService {
  async createUser(email, preferences = {}) {
    const db = await connectDB();
    
    const user = {
      email: email.toLowerCase(),
      preferences: {
        level: preferences.level || 'junior',
        ...preferences
      },
      subscribed: true,
      createdAt: new Date(),
      lastSent: null,
      emailSent: 0
    };

    try {
      const result = await db.collection('users').insertOne(user);
      console.log(`User created: ${email}`);
      return result.insertedId;
    } catch (error) {
      if (error.code === 11000) {
        // User already exists, update preferences
        return this.updateUserPreferences(email, preferences);
      }
      throw error;
    }
  }

  async updateUserPreferences(email, preferences) {
    const db = await connectDB();
    
    const updateData = {
      preferences: {
        level: preferences.level,
        ...preferences
      },
      updatedAt: new Date()
    };

    const result = await db.collection('users').updateOne(
      { email: email.toLowerCase() },
      { 
        $set: updateData,
        $setOnInsert: { 
          subscribed: true,
          createdAt: new Date(),
          emailSent: 0
        }
      },
      { upsert: true }
    );

    console.log(`User preferences updated: ${email}`);
    return result;
  }

  async getUser(email) {
    const db = await connectDB();
    return await db.collection('users').findOne({ email: email.toLowerCase() });
  }

  async getAllSubscribedUsers() {
    const db = await connectDB();
    return await db.collection('users')
      .find({ subscribed: true })
      .toArray();
  }

  async unsubscribeUser(email) {
    const db = await connectDB();
    
    const result = await db.collection('users').updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          subscribed: false,
          unsubscribedAt: new Date()
        }
      }
    );

    console.log(`User unsubscribed: ${email}`);
    return result;
  }

  async updateLastSent(email) {
    const db = await connectDB();
    
    return await db.collection('users').updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { lastSent: new Date() },
        $inc: { emailSent: 1 }
      }
    );
  }

  async getUsersForDigest() {
    const db = await connectDB();
    
    // Get users who are subscribed and haven't received an email in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return await db.collection('users')
      .find({
        subscribed: true,
        $or: [
          { lastSent: { $lt: yesterday } },
          { lastSent: null }
        ]
      })
      .toArray();
  }
}

module.exports = new UserService(); 