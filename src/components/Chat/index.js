import React, { useState } from "react";

// You can install bowser for more detailed browser info (optional)
// npm install bowser
import Bowser from "bowser";

const ChatComponent = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to get browser details
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

  // Handle sending the message to the backend
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const browserDetails = getBrowserDetails();
    const message = {
      type: "user",
      text: input,
    };

    const newMessages = [...messages, message];
    setMessages(newMessages);

    // Send the message along with browser details to the backend
    try {
      const payload = {
        message: input,
        browserDetails: browserDetails, // Attach the browser details to the payload
      };
      console.log(payload);
      // Replace this URL with your actual backend API
      // const response = await fetch('https://your-backend-api.com/chat', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(payload),
      // });

      // const responseData = await response.json();
      // console.log(responseData); // Handle the response from the backend

      const aiResponse = input;

      // Add AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: aiResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    // Clear input after sending message
    setInput("");
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
              message.type === "user" ? "bg-blue-100" : "bg-gray-100 ml-auto"
            }`}
          >
            <p className="w-32">{message.text}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-l-md focus:outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;