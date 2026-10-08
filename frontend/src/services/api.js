// Single place that talks to FastAPI. Change the URL in .env (VITE_API_BASE_URL).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const CONNECTION_MSG =
  "Unable to connect to the prediction server. Please make sure the FastAPI backend is running.";

// Turn FastAPI's 422 JSON ({detail:[{loc, msg}]}) into readable text.
function describe422(body) {
  const items = Array.isArray(body?.detail) ? body.detail : [];
  const lines = items.map((d) => {
    const field = String(d.loc?.[d.loc.length - 1] ?? "input").replace(/_/g, " ");
    return `${field}: ${d.msg}`;
  });
  return lines.length
    ? `The server rejected some inputs. ${lines.join("; ")}.`
    : "The server rejected the submitted values. Please check your answers.";
}

export async function predictScore(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000); // never spin forever
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(
      err.name === "AbortError"
        ? "The prediction server took too long to respond. Please try again."
        : CONNECTION_MSG
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 422) throw new Error(describe422(await res.json().catch(() => null)));
  if (!res.ok) throw new Error(`The server returned an error (HTTP ${res.status}). Please try again later.`);

  const data = await res.json().catch(() => null);
  const score = data?.predicted_mental_score;
  if (typeof score !== "number") throw new Error("The server sent a response in an unexpected format.");
  return score;
}
