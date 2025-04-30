const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv");
const path = require("path");

env.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.error("❌ Error sending index.html:", err);
      res.status(500).send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
