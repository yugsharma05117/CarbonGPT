

async function callOpenRouter(prompt) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenRouter Error:", data);
      return { text: "LLM failed", outputTokens: 0 };
    }

    return {
      text: data?.choices?.[0]?.message?.content || "No response",
      outputTokens: data?.usage?.completion_tokens || 0
    };

  } catch (err) {
    console.error("OpenRouter FAIL:", err.message);
    return { text: "LLM failed", outputTokens: 0 };
  }
}

module.exports = { callOpenRouter };