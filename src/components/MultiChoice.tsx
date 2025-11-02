import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface MultiChoiceProps {
  options: string[];
  onSubmit?: (selected: string[]) => void;
  allowMultiple?: boolean;
}

export function MultiChoice({ options, onSubmit, allowMultiple = true }: MultiChoiceProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (option: string) => {
    if (submitted) return;

    if (!allowMultiple) {
      setSelected([option]);
      setSubmitted(true);
      setTimeout(() => {
        onSubmit?.([option]);
      }, 300);
    } else {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      setSubmitted(true);
      onSubmit?.(selected);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-3 ml-2">
      {options.map((option, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => handleToggle(option)}
          disabled={submitted}
          className={`px-4 py-2.5 rounded-lg shadow-sm transition-all text-left flex items-center gap-2 ${
            selected.includes(option)
              ? 'bg-blue-500 text-white border-2 border-blue-500'
              : 'bg-white text-blue-500 border-2 border-blue-500'
          }`}
        >
          {selected.includes(option) && <Check size={16} />}
          <span>{option}</span>
        </motion.button>
      ))}
      
      {allowMultiple && selected.length > 0 && !submitted && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="mt-2 px-4 py-2.5 bg-green-500 text-white rounded-lg shadow-sm"
        >
          Отправить
        </motion.button>
      )}
    </div>
  );
}
