import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

const SOCKET_URL = "https://mtm-cms-backend-production.up.railway.app/";

const ComplaintChat = ({ complaintId, token, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const scrollRef = useRef();
  const authUserId = user._id;

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      query: { userId: user._id },
    });

    socketRef.current.emit("joinRoom", `complaint_${complaintId}`);

    socketRef.current.on("newMessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          message: message.message || message.text,
        },
      ]);
    });

    socketRef.current.on("onlineUsers", setOnlineUsers);

    socketRef.current.on("typing", (data) => {
      if (data.user !== user._id) {
        setTypingUser(data.userName);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    return () => socketRef.current.disconnect();
  }, [complaintId, token]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/complaints/${complaintId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Fetch complaint messages:", err);
      }
    };
    fetchMessages();
  }, [complaintId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const text = newMsg.trim();

    // ✅ Instant UI update
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: { _id: user._id, name: user.name },
      message: text,
      createdAt: new Date().toISOString(),
    };

    // setMessages((prev) => [...prev, tempMsg]);
    setNewMsg("");

    // ✅ Emit socket
    socketRef.current.emit("newMessage", {
      complaintId,
      message: tempMsg,
      room: `complaint_${complaintId}`,
    });

    try {
      await api.post(`/complaints/${complaintId}/message`, { message: text });
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    socketRef.current.emit("typing", {
      room: `complaint_${complaintId}`, // ✅ add this
      user: user._id,
      userName: user.name,
    });
  };

  const uniqueSenders = [
    ...new Map(messages.map((msg) => [msg.sender._id, msg.sender])).values(),
  ];

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4 border">
      <div className="flex gap-4 px-4">
        {uniqueSenders
          .filter((s) => s._id !== user._id) // 🟢 current user ko skip
          .map((sender) => (
            <div
              key={sender._id}
              className="mb-2 text-sm font-medium flex items-start flex-col justify-center"
            >
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center mr-2">
                  {sender.name.slice(0, 1)}
                </div>
                <div className="flex flex-col">
                  <p>{sender.name}</p>
                  <p
                    className={`text-xs flex items-center gap-[2px] ${
                      onlineUsers.includes(sender._id)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        onlineUsers.includes(sender._id)
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    {onlineUsers.includes(sender._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* <h3 className="text-lg font-semibold mb-3">{user.name}</h3> */}

      <div className="h-64 overflow-y-auto border p-3 rounded bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender?._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 mb-2 rounded-lg text-sm shadow ${
                msg.sender?._id === user._id
                  ? "bg-[#005C4B] text-white self-end rounded-tr-none"
                  : "bg-[#202C33] text-white self-start rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.message || msg.text}</p>

              <div className="flex justify-end gap-1 items-center opacity-80 mt-1">
                <span className="text-[10px]">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[10px]">{msg.sender.name}</span>
              </div>
            </div>
          </div>
        ))}

        <div ref={scrollRef}></div>
      </div>

      {/* ✅ Typing indicator */}
      {typingUser && (
        <div className="flex justify-start">
          <div className="bg-white border px-3 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <div className="typing-bubble flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <div className="text-xs text-gray-500">typing...</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="mt-3 flex items-center space-x-2">
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 focus:outline-blue-600"
          placeholder="Type a message..."
          value={newMsg}
          onChange={handleTyping}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ComplaintChat;
