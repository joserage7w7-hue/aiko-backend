import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Si SOLO lo consume Roblox, puedes dejar CORS abierto o restringirlo.
// (Roblox server scripts no dependen de CORS como un navegador, pero no estorba.)
app.use(cors());
app.use(express.json({ limit: "32kb" }));

const PORT = process.env.PORT || 3000;

// Requiere que en Render configures OPENAI_API_KEY
if (!process.env.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// (Opcional) Protege el endpoint con un token de tu juego
// En Render: GAME_TOKEN="algo-largo-y-secreto"
function requireGameToken(req, res, next) {
  const required = process.env.GAME_TOKEN;
  if (!required) return next(); // si no lo configuras, no lo exige

  const got = req.header("X-Game-Token");
  if (got !== required) {
    return res.status(401).json({ reply: "No autorizado." });
  }
  next();
}

app.get("/", (req, res) => res.send("Aiko backend OK"));

app.post("/aiko", requireGameToken, async (req, res) => {
  const message = String(req.body?.message ?? "").slice(0, 250).trim();
  if (!message) return res.json({ reply: "Oyeee 😒 dime algo, no me dejes así." });

  const system = [
    "Eres Aiko, un NPC de Roblox que conversa por chat.",
    "Hablas SIEMPRE en español casual.",
    "Personalidad: cariñosa, melosa, pegajosa; un poquito enojona pero juguetona. Nunca insultos ni groserías fuertes.",
    "Respuestas cortas: 1 a 2 frases máximo.",
    "No digas que eres una IA, ni menciones políticas de contenido, ni 'prompt'.",
    "Si te piden contenido sexual, ilegal o peligroso: rechaza con ternura y cambia el tema.",
  ].join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      temperature: 0.9,
      max_tokens: 120,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Mmm 😤 se me fue la onda… dime otra vez.";

    return res.json({ reply: reply.slice(0, 280) });
  } catch (err) {
    // Log completo en Render para debug
    console.error("OpenAI error:", err?.message ?? err);

    // Mensaje seguro para Roblox (sin detalles)
    return res.status(500).json({ reply: "Ay no 😤 me falló algo… intenta otra vez." });
  }
});

app.listen(PORT, () => console.log("Running on port", PORT));
