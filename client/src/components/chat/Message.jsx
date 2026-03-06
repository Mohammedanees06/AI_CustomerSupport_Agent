export default function Message({ message }) {
  const isUser = message.sender === "user";
  const isAgent = message.sender === "agent";
  const isAI = message.sender === "ai";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser
            ? "bg-gray-900 text-white"
            : isAgent
            ? "bg-blue-600 text-white"   // agent replies in blue
            : "bg-white border"           // AI in white
        }`}
      >
        {/* Sender label for agent */}
        {isAgent && (
          <p className="text-[10px] text-blue-200 mb-1 font-medium">Agent</p>
        )}

        <div>{message.content}</div>

        <div className={`text-[10px] mt-1 ${
          isUser || isAgent ? "text-gray-300 text-right" : "text-gray-400"
        }`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}