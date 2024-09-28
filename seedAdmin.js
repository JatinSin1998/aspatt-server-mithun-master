import mongoose from "mongoose";
import bcrypt from "bcrypt";
import auth from "./models/auth.js"; // Correct the path if necessary
import dotenv from "dotenv";

dotenv.config();

// Use the following URI when running a local MongoDB server
const uri = process.env.MONGODBURL;

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedAdmin(); // Call the seeder function
    mongoose.disconnect(); // Disconnect after seeding is done
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const seedAdmin = async () => {
  try {
    // Check if the admin user already exists
    const existingAdmin = await auth.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // Create a new admin user
    const adminUser = new auth({
      userType: "Admin",
      fname: "Admin",
      lname: "User",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      verified: true,
    });

    // Save the admin user to the database
    await adminUser.save();

    console.log("Admin user seeded successfully!");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
