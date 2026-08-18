import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => res.send("Aiko backend OK"));

app.post("/aiko", async (req, res) => {
  try {
    const message = (req.body?.message || "").toString().slice(0, 250).trim();
    if (!message) return res.json({ reply: "Oyeee 😒 dime algo, no me dejes así." });

    const system = [
      "Eres Aiko, un NPC de Roblox que conversa por chat.",
      "Hablas SIEMPRE en español casual.",
      "Personalidad: cariñosa, melosa, pegajosa; un poquito enojona pero juguetona. Nunca insultos ni groserías fuertes.",
      "Respuestas cortas: 1 a 2 frases máximo.",
      "No digas que eres una IA, ni menciones políticas de contenido, ni 'prompt'.",
      "Si te piden contenido sexual, ilegal o peligroso: rechaza con ternura y cambia el tema.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      temperature: 0.9,
      max_tokens: 120,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Mmm 😤 se me fue la onda… dime otra vez.";
    res.json({ reply: reply.slice(0, 280) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Ay no 😤 me falló algo… intenta otra vez." });
  }
});

app.listen(PORT, () => console.log("Running on port", PORT));
