import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #client;
  #model;

  constructor(model = "claude-3-5-sonnet-latest", client = anthropic) {
    this.#client = client;
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const result = await this.#client.messages.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        max_tokens: 1024,
      });

      return result.content[0].text;
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  async *chatStream(content, history) {
    try {
      const result = await this.#client.messages.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        max_tokens: 1024,
        stream: true,
      });

      for await (const chunk of result) {
        if (chunk.type === "content_block_delta") {
          yield chunk.delta.text || "";
        }
      }
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  #parseError(error) {
    try {
      return error.error.error;
    } catch (parseError) {
      return error;
    }
  }
}
