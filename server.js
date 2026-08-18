const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// IMPORTANTE en Render:
const PORT = process.env.PORT || 3000;

// Ruta raíz para probar en el navegador
app.get("/", (req, res) => {
  res.send("Aiko backend OK");
});

// Endpoint que usará Roblox
app.post("/aiko", (req, res) => {
  const message = (req.body?.message || "").toString().slice(0, 200);
  res.json({ reply: `Ayyy "${message}"... ven acá 😤💗` });
});

app.listen(PORT, () => console.log("Running on port", PORT));
