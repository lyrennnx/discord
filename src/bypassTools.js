import { config } from "./config.js";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function validateUrl(value) {
  if (!value || typeof value !== "string") {
    throw new Error("Send a valid URL.");
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("That does not look like a valid URL.");
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only http and https links are supported.");
  }

  return parsed.toString();
}

export function getBypassResult(payload) {
  return (
    payload?.destination ||
    payload?.result ||
    payload?.url ||
    payload?.target ||
    payload?.data?.destination ||
    payload?.data?.result ||
    payload?.data?.url ||
    null
  );
}

export async function bypassLink(url) {
  const cleanUrl = validateUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(config.bypassApiUrl, {
      method: "POST",
      headers: {
        "x-api-key": config.bypassApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: cleanUrl, refresh: false }),  
      signal: controller.signal
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "unknown content type";

    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      const preview = text.replace(/\s+/g, " ").slice(0, 160);
      throw new Error(
        `API returned non-JSON (${response.status}, ${contentType}). Check BYPASS_TOOLS_API_URL. Preview: ${preview}`
      );
    }

    if (!response.ok) {
      const message = payload?.message || payload?.error || `API returned ${response.status}`;
      throw new Error(message);
    }

    const result = getBypassResult(payload);
    if (!result) {
      throw new Error("The API responded, but no bypass result was found.");
    }

    return {
      originalUrl: cleanUrl,
      result,
      raw: payload
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The bypass request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
