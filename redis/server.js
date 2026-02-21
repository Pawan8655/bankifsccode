const express = require("express");
const redisRoutes = require("./routes");

const app = express();
const PORT = 3000;

app.use(express.json());

// redis routes
app.use("/", redisRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Express + Redis server running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
