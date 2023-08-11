require("dotenv").config();
const  mongoose= require("mongoose");

const dbConnectionString = process.env.DB_CONNECTION_STRING;

const connectToDB = async () => {
  await mongoose.connect(dbConnectionString);
};

module.exports = connectToDB;