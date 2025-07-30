'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ count = 5, value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              className="hidden"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
            />
            <Star
              className="cursor-pointer"
              color={(ratingValue <= (hover || value)) ? "#ffc107" : "#e4e5e9"}
              fill={(ratingValue <= (hover || value)) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
}
