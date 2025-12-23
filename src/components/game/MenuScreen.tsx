import { DIFFICULTIES } from '@/types/game';
import { cn } from '@/lib/utils';

interface MenuScreenProps {
  onStartGame: (difficulty: number) => void;
}

export function MenuScreen({ onStartGame }: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-primary mb-4 text-shadow-glow">
          SHADOWBOX
        </h1>
        <p className="font-display text-xs md:text-sm text-muted-foreground">
          RTS TRAINER LAB
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="w-full max-w-md space-y-4">
        <h2 className="font-display text-sm text-center text-foreground mb-6">
          SELECT DIFFICULTY
        </h2>

        <div className="grid gap-3">
          {DIFFICULTIES.map((diff, index) => (
            <button
              key={diff.name}
              onClick={() => onStartGame(index)}
              className={cn(
                "game-button w-full flex items-center justify-between",
                index === 0 && "bg-accent text-accent-foreground border-accent",
                index === 1 && "bg-primary text-primary-foreground border-primary",
                index === 2 && "bg-warning text-warning-foreground border-warning",
                index === 3 && "bg-destructive text-destructive-foreground border-destructive"
              )}
            >
              <span>{diff.label}</span>
              <span className="font-game text-xs opacity-70">
                {diff.config.yellowCount}Y / {diff.config.whiteCount}W
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 max-w-md text-center space-y-4">
        <h3 className="font-display text-xs text-muted-foreground">HOW TO PLAY</h3>
        <div className="font-game text-sm text-muted-foreground space-y-2">
          <p>
            <span className="text-primary">●</span> Click & drag to create a selection box
          </p>
          <p>
            <span className="text-primary">●</span> Capture <span className="text-primary">yellow</span> circles (GOOD)
          </p>
          <p>
            <span className="text-secondary">●</span> Avoid <span className="text-secondary">white</span> circles (BAD)
          </p>
          <p>
            <span className="text-destructive">♥</span> Don't let your health or timer run out!
          </p>
        </div>
      </div>
    </div>
  );
}
