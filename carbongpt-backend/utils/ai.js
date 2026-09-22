const fetch = require("node-fetch"); // safer

async function generateResponse(prompt) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data?.error?.message || "Request failed");
    }



    return {
      text: data.choices?.[0]?.message?.content || "No response",
      outputTokens: data.usage?.completion_tokens || 0
    };

  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      text: "AI failed",
      outputTokens: 0
    };
  }
}

module.exports = { generateResponse };