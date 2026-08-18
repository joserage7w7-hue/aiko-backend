import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Aiko backend OK"));

app.post("/aiko", (req, res) => {
  const message = (req.body?.message || "").toString().slice(0, 200);
  res.json({ reply: `Ayyy "${message}"... ven acá 😤💗` });
});

app.listen(PORT, () => console.log("Running on port", PORT));