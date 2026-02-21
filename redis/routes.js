const express = require("express");
const client = require("./client");

const router = express.Router();

// connect redis once
(async () => {
  await client.connect();
  console.log("Redis connected");
})();

// set value
router.get("/set", async (req, res) => {
  await client.set("key", "value");
  res.send("Key set in Redis");
});

// get value
router.get("/get", async (req, res) => {
  const value = await client.get("key");
  res.send(`Value from Redis: ${value}`);
});

module.exports = router;
