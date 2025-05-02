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
  .connect(process.env.MONGODB_MUSIC_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const db = mongoose.connection.db;
    console.log("Connected to MongoDB Database:", db.databaseName); // Check connected database
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/tracks", async (req, res) => {
  const searchQuery = req.query.search?.trim();
  console.log(searchQuery);
  try {
    const collection = mongoose.connection.collection("tracks");
    const filter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {}; // empty query returns any 10 tracks
    const tracks = await collection.find(filter).limit(10).toArray();
    console.log(tracks);
    res.json(tracks);
  } catch (err) {
    console.error("Error fetching tracks:", err);
    res.status(500).send("Error fetching tracks");
  }
});

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
