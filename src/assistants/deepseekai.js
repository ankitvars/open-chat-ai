import OpenAI from "openai";
import { Assistant as OpenAIAssistant } from "../assistants/openai";

// Initialize the OpenAI-compatible client for DeepSeek
const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com", // ✅ Add `/v1` to match OpenAI-compatible API structure
  apiKey: import.meta.env.VITE_DEEPSEEK_AI_API_KEY,
  dangerouslyAllowBrowser: true, // ⚠️ Avoid in production
});

export class Assistant extends OpenAIAssistant {
  constructor(model = "deepseek-chat", client = deepseek) {
    super(model, client);
  }
}
