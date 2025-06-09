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
      const stream = await this.#client.chat.completions.stream({
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
    if (error.response && error.response.data && error.response.data.error) {
      // OpenAI API error with details
      return {
        message:
          error.response.data.error.message ||
          `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
        code: error.response.data.error.code,
        type: error.response.data.error.type,
      };
    } else if (error.response) {
      // Server responded with a status code outside 2xx range
      return {
        message: `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
      };
    } else if (error.request) {
      // No response was received
      return {
        message: "Network Error: No response received from the server.",
      };
    } else if (typeof error === "string") {
      return { message: error };
    } else if (error && error.message) {
      return { message: error.message };
    } else {
      // Something else happened
      return { message: "Unknown error occurred." };
    }
  }
}
