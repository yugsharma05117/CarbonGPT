const API = import.meta.env.VITE_API_URL;

export const sendPrompt = async (prompt) => {
  try {
    console.log("Sending request to backend...");

    const res = await fetch(`${API}/prompt`, {
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