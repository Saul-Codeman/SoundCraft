const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("/Users/seanroberts/Desktop/SoundCraft/frontend/dist"));

app.get("/", (req, res) => {
  res.sendFile(
    "/Users/seanroberts/Desktop/SoundCraft/frontend/dist/index.html"
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
