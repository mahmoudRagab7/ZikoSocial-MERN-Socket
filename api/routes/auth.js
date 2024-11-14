const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Add multer upload handling in auth.js
const multer = require("multer");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Specify the folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Unique filename using timestamp
  },
});
const upload = multer({ storage: storage });

// Register route to handle profile picture upload
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    // Check if username is already taken
    const existingUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already used" });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already used" });
    }

    // Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Handle file upload and add profilePicture field
    const profilePicture = req.file ? req.file.filename : null;

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      city: req.body.city,
      from: req.body.from,
      desc: req.body.desc,
      relationship: req.body.relationship,
      profilePicture: profilePicture, // Save the file name in the database
    });

    // Save user and send response
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
