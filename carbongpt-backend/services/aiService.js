

async function callGroq(prompt) {
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
        ],
        temperature: 0.1
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Groq API Error:", errorData);
      throw new Error(errorData?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();



    return {
      text: data.choices?.[0]?.message?.content || "No response from Groq",
      outputTokens: data.usage?.completion_tokens || 0
    };

  } catch (error) {
    console.error("Groq Error:", error.message);
    return {
      text: "AI service temporarily unavailable. Please try again.",
      outputTokens: 0
    };
  }
}

async function generateResponse(prompt) {
  return callGroq(prompt);
}
module.exports = { generateResponse, callGroq };