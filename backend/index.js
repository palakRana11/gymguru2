const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const userModel = require('./models/userModel');
const foodModel = require('./models/foodModel');
const axios = require('axios');
require('dotenv').config({ path: './.env' });

const app = express();

app.use(express.json());
app.use(cors());


const apiKey = process.env.GOOGLE_API_KEY;
console.log("Loaded API Key:", apiKey); // Temporary check


mongoose.connect("mongodb://localhost:27017/gymgurudb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));
//endpoint for Registering a user
app.post('/register', async (req, res) => {
    try {
        let { name, email, password, age } = req.body;

        if (!name || !email || !password || !age) {
            return res.status(400).send({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists . Go to Login" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await userModel.create({ name, email, password: hashedPassword, age });

        res.status(201).send({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).send({ message: "Error registering user" });
    }
});


//endpoint for Login user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).send({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'gymguru-app', { expiresIn: '1h' });

        res.status(200).send({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send({ message: "Error logging in" });
    }
});


// Endpoint for Gemini API
app.post('/gemini', async (req, res) => {
    const { prompt } = req.body;
    console.log("Prompt received:", prompt);

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",   // ✅ Add this line
                        parts: [{ text: prompt }]
                    }
                ]
            }
        );

        const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        res.status(200).json({ reply: result });
    } catch (err) {
        console.error("Gemini API Error:", err.response?.data || err.message); // Show API error details
        res.status(500).json({ message: "Error connecting to Gemini API", details: err.response?.data });
    }
});

app.get('/food', verifyToken, async (req, res) => {
    try {
        // Ensure the DB connection is active
        if (!mongoose.connection.readyState) {
            return res.status(500).json({ message: "Database not connected" });
        }

        // Ensure foodModel is defined
        if (!foodModel) {
            return res.status(500).json({ message: "Food model is not defined" });
        }

        // Fetch food items from MongoDB
        const foods = await foodModel.find({});
        
        // If no food items found, send appropriate response
        if (!foods.length) {
            return res.status(404).json({ message: "No food items found" });
        }

        res.json(foods);
    } catch (err) {
        console.error("Fetching Food Error:", err.message);
        res.status(500).json({ message: "Error fetching food items", error: err.message });
    }
});


//endpoint to search food by name

app.get('/food/search/:name', verifyToken, async (req, res) => {
    try {
        const foodName = req.params.name;
        const foods = await foodModel.find({ name: { $regex: foodName, $options: 'i' } });

        if (foods.length === 0) {
            return res.status(404).send({ message: "No food items found" });
        }

        res.status(200).send(foods);
    } catch (err) {
        console.error("Search Food Error:", err);
        res.status(500).send({ message: "Error searching for food items" });
    }
});


//  endpoint to get user details
app.get('/username', verifyToken, async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).select('name age');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ name: user.name, age: user.age });
  
    } catch (err) {
      console.error("Username Fetch Error:", err);
      res.status(500).json({ message: "Error fetching username" });
    }
  });
  


//middleware to verify JWT token

function verifyToken(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'gymguru-app', (err, decoded) => {
            if (err) {
                return res.status(403).send({ message: "Invalid token" });
            }
            req.user = decoded;
            next(); 
        });
    } else {
        return res.status(403).send({ message: "Token is required" });
    }
}
app.listen(8000, () => {
    console.log("Server started on port 8000");
});
