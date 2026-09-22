export const sendPrompt = async (prompt) => {
  try {
    console.log("Sending request to backend...");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://carbon-gpt.onrender.com";
    const res = await fetch(`${BACKEND_URL}/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      throw new Error("Backend error");
    }

    const data = await res.json();

    console.log("Backend response:", data);

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};