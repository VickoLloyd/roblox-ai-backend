import express from "express";
import fetch from "node-fetch";

const HF_API_KEY = "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"; // YOUR HuggingFace API key
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

const app = express();

app.get("/chat", async (req, res) => {
  const userMessage = req.query.q || "Hello";

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a friendly civilian NPC in Roblox. Player said: "${userMessage}". Reply naturally.`,
          parameters: { max_new_tokens: 60 },
        }),
      }
    );

    const data = await response.json();

    const text = data[0]?.generated_text || "Sorry, I can't talk right now.";

    res.send(text);
  } catch (error) {
    console.error(error);
    res.send("Sorry, I can't talk right now.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
