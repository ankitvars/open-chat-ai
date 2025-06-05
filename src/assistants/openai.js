import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #client;
  #model;

  constructor(model = "gpt-4.1", client = openai) {
    this.#client = client;
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const response = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { role: "user", content }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  async *chatStream(content, history) {
    try {
      const stream = await this.#client.beta.chat.completions.stream({
        model: this.#model,
        messages: [...history, { role: "user", content }],
        stream: true,
      });

      for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  #parseError(error) {
    if (error.response) {
      // Server responded with a status code outside 2xx range
      return `HTTP Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      // No response was received
      return "Network Error: No response received from the server.";
    } else {
      // Something else happened
      return `Error: ${error.message}`;
    }
  }
}
