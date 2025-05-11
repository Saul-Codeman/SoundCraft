const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv");
const path = require("path");
const AWS = require("aws-sdk");

env.config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const { AWS_BUCKET_NAME } = process.env;

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
  try {
    const collection = mongoose.connection.collection("tracks");
    const filter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {}; // empty query returns any 10 tracks
    const tracks = await collection.find(filter).limit(10).toArray();
    res.json(tracks);
  } catch (err) {
    console.error("Error fetching tracks:", err);
    res.status(500).send("Error fetching tracks");
  }
});

async function getTrack(trackId) {
  try {
    const collection = mongoose.connection.collection("tracks");
    const track = await collection.findOne({ id: trackId });

    if (!track) {
      throw new Error(`Track with ID ${trackId} not found`);
    }
    return track;
  } catch (err) {
    console.error("Error fetching track:", err);
    throw new Error(`Error fetching track ${trackId}`);
  }
}

app.get("/api/tracks/downloads/:id", async (req, res) => {
  const trackId = req.params.id;
  if (!trackId) return res.status(400).send("Track ID is required");

  try {
    const track = await getTrack(trackId);

    if (!track) {
      return res.status(404).send(`Track with ID ${trackId} not found`);
    }

    const audioUrl = track.s3_audio_url;
    const s3Key = audioUrl.split("amazonaws.com/")[1];

    const s3Params = {
      Bucket: AWS_BUCKET_NAME,
      Key: s3Key,
    };

    const s3Object = await s3.getObject(s3Params).promise();

    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Disposition", "inline; filename=" + track.name);
    res.send(s3Object.Body);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching track data");
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
