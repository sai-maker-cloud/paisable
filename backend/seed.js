const mongoose = require('mongoose');
const IncomeExpense = require('./models/IncomeExpense'); // adjust path if needed

// 👇 Replace this with a valid ObjectId from your User collection
const userId = new mongoose.Types.ObjectId("68e60a61599d061c090b8e61");

const MONGO_URI = "mongodb://127.0.0.1:27017/paisable";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const categories = ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Freelance", "Salary", "Investments"];
const names = ["Lunch", "Bus Fare", "Netflix", "Electric Bill", "Client Payment", "Bonus", "Snacks", "Movie"];

async function seedData() {
  try {
    await IncomeExpense.deleteMany({});
    console.log("🧹 Cleared existing data");

    const records = [];
    const today = new Date();

    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // go back i days

      const numEntries = Math.floor(Math.random() * 3) + 1; // 1–3 records per day

      for (let j = 0; j < numEntries; j++) {
        const isIncome = Math.random() > 0.5;
        const record = {
          user: userId,
          name: names[Math.floor(Math.random() * names.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          cost: parseFloat((Math.random() * (isIncome ? 2000 : 500)).toFixed(2)),
          addedOn: date,
          isIncome,
          note: isIncome ? "Received income" : "Spent money",
          isDeleted: false,
        };
        records.push(record);
      }
    }

    await IncomeExpense.insertMany(records);
    console.log(`✅ Inserted ${records.length} income/expense records`);

    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    mongoose.connection.close();
  }
}

seedData();

