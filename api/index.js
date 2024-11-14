const express = require("express");
const app = express();
const port = process.env.PORT || 8800;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");

const cors = require("cors"); // Import cors

dotenv.config();

const url = process.env.MONGO_URL;
// const url = process.env.DB_CONNECTION_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/images", express.static(path.join(__dirname, "public/images")));

//   middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({ origin: "https://zikosocial-frontend.onrender.com/" })); // Allow requests from frontend

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname); // for postman uploads
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.use("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(port, () => {
  console.log(`running succefully on port ${port}`);
});
