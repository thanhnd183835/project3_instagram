const mongoose = require('mongoose');

// connect database by mongodb
const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDB;
