import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  hearts: number;
  timer: number;
  score: number;
  combo: number;
  round: number;
}

export function GameHUD({
  health,
  maxHealth,
  hearts,
  timer,
  score,
  combo,
  round,
}: GameHUDProps) {
  const healthPercentage = (health / maxHealth) * 100;
  const isLowHealth = healthPercentage < 30;
  const isMidHealth = healthPercentage >= 30 && healthPercentage < 60;
  const isLowTime = timer <= 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between pointer-events-none z-10">
      {/* Left Side - Health Bar */}
      <div className="flex flex-col gap-2">
        <div className="bg-card/80 backdrop-blur-sm rounded px-3 py-2 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-xs text-muted-foreground">HP</span>
            <span className="font-game text-sm font-bold">
              {health}/{maxHealth}
            </span>
          </div>
          <div className="health-bar w-32">
            <div
              className={cn(
                "health-fill",
                isLowHealth && "health-low",
                isMidHealth && "health-mid",
                !isLowHealth && !isMidHealth && "health-full"
              )}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Round indicator */}
        <div className="bg-card/80 backdrop-blur-sm rounded px-3 py-1 border border-border">
          <span className="font-display text-xs text-muted-foreground">ROUND </span>
          <span className="font-display text-xs text-primary">{round}</span>
        </div>
      </div>

      {/* Center - Score */}
      <div className="flex flex-col items-center gap-1">
        <div className="bg-card/80 backdrop-blur-sm rounded px-4 py-2 border border-border">
          <span className="font-display text-lg text-primary text-shadow-glow">
            {score.toLocaleString()}
          </span>
        </div>
        {combo > 1 && (
          <div className="combo-badge animate-pop-in">
            <span>×{(1 + (combo - 1) * 0.1).toFixed(1)}</span>
            <span className="text-accent-foreground/70">COMBO</span>
          </div>
        )}
      </div>

      {/* Right Side - Timer & Hearts */}
      <div className="flex flex-col items-end gap-2">
        <div className="bg-card/80 backdrop-blur-sm rounded px-3 py-2 border border-border">
          <div className={cn(
            "font-display text-xl tabular-nums",
            isLowTime && "timer-urgent text-destructive"
          )}>
            {formatTime(timer)}
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded px-3 py-2 border border-border flex gap-1">
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
      </div>
    </div>
  );
}
