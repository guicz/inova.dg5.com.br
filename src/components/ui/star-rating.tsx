"use client";

import { useState } from 'react';
import { Star, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
  colorClassName?: string;
}

export function StarRating({ value, onChange, colorClassName = 'text-pioneer' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const stars = Array(5).fill(0);

  const handleClick = (newValue: number) => {
    onChange(newValue);
  };

  const handleClear = () => {
    onChange(0);
  }

  const handleMouseEnter = (newHoverValue: number) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {stars.map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= (hoverValue ?? value ?? 0);
          return (
            <button
              type="button"
              key={starValue}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "p-1 transition-transform duration-200 ease-in-out hover:scale-125 focus:outline-none focus:scale-125",
                isFilled ? colorClassName : 'text-gray-300'
              )}
              aria-label={`Avaliação ${starValue} de 5`}
            >
              <Star
                className={cn(
                  "h-6 w-6 sm:h-8 sm:w-8",
                  isFilled && 'fill-current'
                )}
              />
            </button>
          );
        })}
      </div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className={cn(
                  "h-8 w-8 rounded-full",
                  value === 0 ? colorClassName : 'text-gray-400 hover:text-gray-600'
              )}
              aria-label="Limpar avaliação para 0"
            >
              <XCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Limpar avaliação (0 estrelas)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
