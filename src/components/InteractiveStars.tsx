import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface InteractiveStarsProps {
  onRate?: (rating: number) => void;
  autoSelect?: number;
}

export function InteractiveStars({ onRate, autoSelect }: InteractiveStarsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(autoSelect || null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setTimeout(() => {
      onRate?.(rating);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-2 mb-3 ml-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(star)}
            className="p-1"
            disabled={selectedRating !== null}
          >
            <Star
              size={36}
              className={`${
                star <= (selectedRating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
