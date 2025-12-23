import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  hearts: number;
  timer: number;
  round: number;
}

export function GameHUD({ hearts, timer, round }: GameHUDProps) {
  const isLowTime = timer <= 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between pointer-events-none z-10">
      {/* Left - Hearts */}
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              "heart-icon",
              i < hearts ? "heart-filled fill-current" : "heart-empty"
            )}
          />
        ))}
      </div>

      {/* Center - Round */}
      <div className="text-center">
        <div className="text-[10px] text-muted-foreground mb-1">ROUND</div>
        <div className="text-2xl text-primary">{round}</div>
      </div>

      {/* Right - Timer */}
      <div className={cn(
        "text-lg tabular-nums",
        isLowTime && "timer-urgent"
      )}>
        {formatTime(timer)}
      </div>
    </div>
  );
}
