// src/components/ChatBubble.tsx
import React from "react";
import clsx from "clsx";
interface Props { role: "user" | "assistant"; content: string; time?: string; }
const ChatBubble: React.FC<Props> = ({ role, content, time }) => {
  const isUser = role === "user";
  return (
    <div className={clsx("flex items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          {/* Updated AI icon gradient: Blue to Orange */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gemini-blue-500 to-jalebi-orange-400 text-white flex items-center justify-center font-semibold">AI</div>
        </div>
      )}

      <div className="max-w-3xl">
        {/* User bubble color: using a darker blue for a clean look */}
        <div className={clsx("px-4 py-3 rounded-2xl break-words shadow-sm", isUser ? "bg-gemini-blue-600 text-white rounded-br-none" : "bg-white/95 text-gray-900 rounded-bl-none")}>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        {time && <div className={clsx("text-xs mt-1", isUser ? "text-right text-gray-300" : "text-left text-gray-400")}>{time}</div>}
      </div>

      {isUser && <div className="flex-shrink-0 mt-1"><div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">U</div></div>}
    </div>
  );
};
export default ChatBubble;