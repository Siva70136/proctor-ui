import React, { useState } from "react";
import { useSelector } from "react-redux";
import Bowser from "bowser";
import Cookies from "js-cookie";
const ChatComponent = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const canvasRef1 = useSelector((state) => state.canvas.canvasReferences);
  const videoRef1 = useSelector((state) => state.canvas.videoReferences);

  const getBrowserDetails = () => {
    const details = Bowser.getParser(window.navigator.userAgent);
    const { browser, platform, os } = details.getResult();
    return {
      browserName: browser.name,
      browserVersion: browser.version,
      platform: platform,
      os: os.name,
    };
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const browserDetails = getBrowserDetails();
    const userMessage = { type: "user", text: input };
    const newMessages = [...messages, userMessage];
    const userId = Cookies.get("userId");

    // Send the message along with browser details to the backend
    try {
      const payload = {
        userId: userId || "",
        query: input,
        browserDetails: browserDetails,
        screen: snapshot ? snapshot : "",
      };

      setMessages(newMessages);
      setInput("");
      setSnapshot("");
      console.log(payload);
      // Replace this URL with your actual backend API
      const response = await fetch(
        "https://8bxf95r2-8000.inc1.devtunnels.ms/agent/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);
      // Simulated AI response
      const aiResponse = data.chat_bot;

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: aiResponse },
      ]);
      //showAiResponse(aiResponse);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const takeSnapshot = () => {
    const canvas1 = canvasRef1.current;
    const context1 = canvas1.getContext("2d");
    context1.drawImage(videoRef1.current, 0, 0, canvas1.width, canvas1.height);
    const snapshot = canvas1.toDataURL("image/jpeg");
    setSnapshot(snapshot);
  };

  const showAiResponse = (response) => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        const chunk = response.slice(0, currentIndex + 1);
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage?.type === "ai") {
            return [...prevMessages.slice(0, -1), { type: "ai", text: chunk }];
          }
          return [...prevMessages, { type: "ai", text: chunk }];
        });
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  return (
    <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg border p-4 max-h-[400px] overflow-auto">
      {/* Chat Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Chat with AI</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          X
        </button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 h-64 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-36 ${
              message.type === "ai" ? "bg-blue-100" : "bg-gray-100 ml-auto"
            }`}
          >
            <p className="w-32">{message.text}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex">
        <div className="flex">
          <form
            className="flex w-full relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-l-md focus:outline-none"
                placeholder="Type a message"
              />
              <button
                type="button"
                onClick={takeSnapshot}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                title="Add Image"
              >
                <img
                  src={snapshot || "https://example.com/path-to-icon.png"}
                  alt="Add"
                  className="h-5 w-5"
                />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
