import { FormEvent, useState } from "react";
import { Send, Phone } from "lucide-react";

const ScreenMessage = () => {
  return <MessagingUI />;
};
function MessagingUI() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "you and scrambled it to scramblef",
    },
    {
      id: 2,
      sender: "assistant",
      text: "you and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in",
    },
    {
      id: 3,
      sender: "user",
      text: "you and scrambled it to",
    },
    {
      id: 4,
      sender: "user",
      text: "type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in",
    },
  ]);

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "user", text: inputValue },
      ]);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-indigo-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21v-2a8 8 0 0 0-16 0v2" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="font-medium text-gray-800">Assistant</div>
            <div className="text-xs text-green-600">Online</div>
          </div>
        </div>
        <div className="ml-auto">
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          <div className="text-center my-4">
            <span className="text-xs bg-gray-200 text-gray-500 px-4 py-1 rounded-full">
              9:31 PM
            </span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-xl ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white h-24">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Type here"
            className="text-sm flex-1 p-2 bg-white border-gray-300 rounded-l-lg focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-lg"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
export default ScreenMessage;
