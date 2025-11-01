import React from 'react';

interface ActionButtonsProps {
  buttons: string[];
  onButtonClick?: (button: string) => void;
}

export function ActionButtons({ buttons, onButtonClick }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mb-3 ml-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => onButtonClick?.(button)}
          className="bg-white border-2 border-blue-500 text-blue-500 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left"
        >
          {button}
        </button>
      ))}
    </div>
  );
}
