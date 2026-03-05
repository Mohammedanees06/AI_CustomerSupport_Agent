export default function Message({ message }) {
  const isAI = message.sender === "ai";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isAI ? "bg-white border" : "bg-gray-900 text-white"
        }`}
      >
        <div>{message.content}</div> {/* ✅ was message.text */}

        <div
          className={`text-[10px] mt-1 ${
            isAI ? "text-gray-400" : "text-gray-300"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}