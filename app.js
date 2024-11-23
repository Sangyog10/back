import express from "express";

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("testing");
});

export { app };
