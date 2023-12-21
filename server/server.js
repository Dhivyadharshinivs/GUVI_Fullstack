const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

// Middleware configuration
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: false }));

// Connect to MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishadhi@14",
  database: "guvi",
});


// Signup route
app.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check for existing user with the same email
      const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      await db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
  
      res.json({ message: "User registered successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login route
  app.post("/login", async (req, res) => {
    try {
      const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [
        req.body.email,
      ]);
  
      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
        if (passwordMatch) {
          // Generate a unique token (replace with your preferred token generation logic)
          const token = generateUniqueToken();
  
          // Store the token in the database or a separate token storage system
          await db.execute("UPDATE users SET token = ? WHERE email = ?", [token, user.email]);
  
          res.json({ message: "Login successful", user, token });
        } else {
          res.status(401).json({ message: "Invalid email or password" });
        }
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Profile route (GET) - Fetching based on email
app.get("/profile", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [
        req.session.user.email, // Use email instead of ID
      ]);
  
      if (results.length > 0) {
        res.json({ user: results[0] });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  
// Profile update route
app.put("/profile", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      await db.execute(
        "UPDATE users SET age = ?, gender = ?, mobile = ?, dob = ? WHERE email = ?",
        [req.body.age, req.body.gender, req.body.mobile, req.body.dob, req.session.user.email] // Use email for update
      );
  
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });


// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});