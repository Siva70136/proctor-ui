import React, { useState } from "react";
import ChatComponent from "../Chat";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        💬
      </button>

      {isChatOpen && <ChatComponent onClose={toggleChat} />}
    </div>
  );
};

export default ChatButton;
