import { FormEvent, useState, useEffect, useRef } from "react";
import { Send, Phone } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

type Message = {
  id: number;
  is_from_device: boolean;
  text: string;
};

const ScreenMessage = () => {
  return <MessagingUI />;
};
function MessagingUI() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("messages--------------", messages);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const userInfo = localStorage.getItem("userInfo");
  const device_id = userInfo
    ? JSON.parse(userInfo).user.restaurants[0].device_id
    : null;
  const restaurant_id = userInfo
    ? JSON.parse(userInfo).user.restaurants[0].id
    : null;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!userInfo || !accessToken) return;

    const wsUrl = `wss://abc.winaclaim.com/ws/chat/${device_id}/?token=${accessToken}`;
    ws.current = new window.WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Only add if it's a message (not an error or other type)
        if (data.message && typeof data.message === "string") {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1, // or use data.id if provided
              is_from_device: data.is_from_device,
              text: data.message,
            },
          ]);
        }
      } catch {
        console.error("Invalid message received:", event.data);
      }
    };
    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.current?.close();
    };
  }, [device_id, userInfo]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/message/chat/?device_id=${device_id}&restaurant_id=${restaurant_id}`
        );
        // Map the response to your Message type
        type ApiMessage = {
          id: number;
          is_from_device: boolean;
          message: string;
        };
        const mapped = (response.data || []).map((msg: ApiMessage) => ({
          id: msg.id,
          is_from_device: msg.is_from_device,
          text: msg.message, // or msg.text if that's the field
        }));

        setMessages(mapped);
      } catch {
        toast.error("Failed to load previous messages.");
        setMessages([]);
      }
    };
    if (device_id && restaurant_id) fetchMessages();
  }, [device_id, restaurant_id, userInfo]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast.error("Connection lost. Please refresh the page.");
      return;
    }
    try {
      ws.current.send(
        JSON.stringify({
          type: "message",
          message: inputValue,
          // add any other fields your backend expects, e.g. device_id, user_id, etc.
        })
      );
      setInputValue(""); // Clear input
      // Optionally, add to local state for instant feedback:
      // setMessages([...messages, { id: ..., is_from_device: false, text: inputValue }]);
    } catch {
      toast.error("Failed to send message");
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
          {messages.length > 0 && (
            <>
              <div className="text-center my-4">
                <span className="text-xs bg-gray-200 text-gray-500 px-4 py-1 rounded-full">
                  9:31 PM
                </span>
              </div>
              {messages
                .filter((message) => message.text && message.text.trim() !== "")
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end ${
                      message.is_from_device === false
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {/* Avatar for assistant (left) */}
                    {message.is_from_device === false && (
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                        <span className="text-indigo-700 font-bold">A</span>
                        {/* Or use an <img src="..." /> for a real avatar */}
                      </div>
                    )}
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-xl ${
                        message.is_from_device === false
                          ? "bg-gray-200 text-gray-800 rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {/* Avatar for user (right) */}
                    {message.is_from_device === true && (
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center ml-2">
                        <span className="text-blue-700 font-bold">U</span>
                        {/* Or use an <img src="..." /> for a real avatar */}
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
          <div ref={messagesEndRef} />
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
