export default function Message({ message }) {
  const isAgent = message.sender === "agent";

  return (
    <div
      className={`flex ${
        isAgent ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isAgent
            ? "bg-gray-900 text-white"
            : "bg-white border"
        }`}
      >
        <div>{message.text}</div>

        {/* timestamp */}
        <div
          className={`text-[10px] mt-1 ${
            isAgent
              ? "text-gray-300"
              : "text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}