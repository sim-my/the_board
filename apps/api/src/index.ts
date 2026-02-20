import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (_, res) => {
  res.send("Hello from API");
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});