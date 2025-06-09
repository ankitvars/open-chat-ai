import OpenAI from "openai";
import { Assistant as OpenAIAssistant } from "../assistants/openai";

const openai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: import.meta.env.VITE_X_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant extends OpenAIAssistant {
  constructor(model = "grok-3-mini-latest", client = openai) {
    super(model, client);
  }

  async *chatStream(content, history = []) {
    try {
      const result = await this.client.chat.completions.create({
        model: this.model,
        messages: [...history, { content, role: "user" }],
        max_tokens: 1024,
      });
      // X AI does not support streaming, so return entire content at once
      yield result.choices?.[0]?.message?.content ?? "";
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  #parseError(error) {
    if (error.response && error.response.data && error.response.data.error) {
      return {
        message:
          error.response.data.error.message ||
          `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
        code: error.response.data.error.code,
        type: error.response.data.error.type,
      };
    } else if (error.response) {
      return {
        message: `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
      };
    } else if (error.request) {
      return {
        message: "Network Error: No response received from the server.",
      };
    } else if (typeof error === "string") {
      return { message: error };
    } else if (error && error.message) {
      return { message: error.message };
    } else {
      return { message: "Unknown error occurred." };
    }
  }
}
