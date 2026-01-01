import { Heart, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  hearts: number;
  timer: number;
  round: number;
  isMusicEnabled: boolean;
  onToggleMusic: () => void;
}

export function GameHUD({ hearts, timer, round, isMusicEnabled, onToggleMusic }: GameHUDProps) {
  const isLowTime = timer <= 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-x-0 top-0 p-4 md:p-8 flex items-start justify-between pointer-events-none z-10 font-display">
      {/* Left - Hearts */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              "heart-icon w-6 h-6 md:w-8 md:h-8",
              i < hearts ? "heart-filled fill-current" : "heart-empty"
            )}
          />
        ))}
      </div>

      {/* Center - Round */}
      <div className="text-center">
        <div className="text-xs md:text-sm text-foreground/70 mb-2 tracking-wider">
          ROUND
        </div>
        <div className="text-4xl md:text-5xl font-bold text-foreground font-display">
          {round}
        </div>
      </div>

      {/* Right - Timer + Music */}
      <div className="flex items-start gap-4">
        <div className={cn(
          "text-3xl md:text-4xl font-bold text-foreground tabular-nums font-display tracking-wider",
          isLowTime && "timer-urgent"
        )}>
          {formatTime(timer)}
        </div>
        <button
          onClick={onToggleMusic}
          className="pointer-events-auto p-1 text-foreground/60 hover:text-foreground transition-colors"
          title={isMusicEnabled ? 'Disable music' : 'Enable music'}
        >
          {isMusicEnabled ? (
            <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
