import React from 'react';

interface ChatBubbleProps {
  message: string;
  isBot: boolean;
  showCheckmark?: boolean;
}

export function ChatBubble({ message, isBot, showCheckmark = false }: ChatBubbleProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-blue-500 text-white rounded-tr-none'
        }`}
      >
        {showCheckmark && <span className="mr-1">✅</span>}
        <span className="whitespace-pre-line">{message}</span>
      </div>
    </div>
  );
}
