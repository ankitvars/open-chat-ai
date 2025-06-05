import { useState, useEffect } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/Chat/Chat.jsx";
import { Controls } from "./components/Controls/Controls.jsx";
import { Assistant as DefaultAssistant } from "./assistants/googleai.js"; // Default
import { Loader } from "./components/Loader/Loader.jsx";
import { Theme } from "./components/Theme/Theme";
import { Assistant } from "./components/Assistant/Assistant";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [assistant, setAssistant] = useState(null);

  // Initialize default assistant
  useEffect(() => {
    const assistantInstance = new DefaultAssistant();
    setAssistant(assistantInstance);
  }, []);

  // Append assistant message chunk
  const updateLastMessageContent = (chunk) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === prevMessages.length - 1
          ? { ...msg, content: msg.content + chunk }
          : msg
      )
    );
  };

  // Add a full message
  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Send message and stream response
  const sendMessage = async (content) => {
    if (!assistant) return;

    addMessage({ role: "user", content });
    setIsLoading(true);

    try {
      const result = await assistant.chatStream(
        content,
        messages.filter(({ role }) => role !== "system")
      );

      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ role: "assistant", content: "" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      console.error("Error during streaming:", error);
      addMessage({
        role: "system",
        content: error?.message || "Something went wrong. Please try again.",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleAssistantChange = (newAssistant) => {
    setAssistant(newAssistant);
  };

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="./chatbot.png" alt="Chatbot Logo" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>

      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>

      <Controls isDisabled={isLoading || isStreaming} onSend={sendMessage} />

      <div className={styles.Configuration}>
        <Assistant onAssistantChange={handleAssistantChange} />
        <Theme />
      </div>
    </div>
  );
};

export default App;
