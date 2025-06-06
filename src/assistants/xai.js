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
    const result = await this.client.chat.completions.create({
      model: this.model,
      messages: [...history, { content, role: "user" }],
      max_tokens: 1024,
    });

    // X AI does not support streaming, so return entire content at once
    yield result.choices?.[0]?.message?.content ?? "";
  }
}
