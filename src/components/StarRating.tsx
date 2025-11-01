import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  onRate?: (rating: number) => void;
}

export function StarRating({ onRate }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedStar(rating);
    onRate?.(rating);
  };

  return (
    <div className="flex justify-start mb-3 ml-2">
      <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleClick(star)}
              className="p-1"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredStar || selectedStar || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
