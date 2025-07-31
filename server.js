import express from "express";
import fetch from "node-fetch";

const HF_API_KEY = "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"; // your key
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

const app = express();

app.get("/chat", async (req, res) => {
  const userMessage = req.query.q || "Hello";

  try {
    const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `You are a friendly civilian NPC in Roblox. Player said: "${userMessage}"`,
        parameters: { max_new_tokens: 60 }
      })
    });

    const data = await hfResponse.json();

    if (data.error) {
      console.error("HF API error:", data.error);
      return res.send("Sorry, I can't talk right now.");
    }

    const reply = Array.isArray(data) && data[0] && data[0].generated_text
      ? data[0].generated_text
      : "Sorry, I can't talk right now.";

    res.send(reply);

  } catch (err) {
    console.error("Backend error:", err);
    res.send("Sorry, I can't talk right now.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
