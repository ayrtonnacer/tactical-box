import { DIFFICULTIES } from '@/types/game';

interface GameOverScreenProps {
  score: number;
  round: number;
  difficultyIndex: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  score,
  round,
  difficultyIndex,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center space-y-8">
        {/* Game Over Title */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-destructive mb-2">
            GAME OVER
          </h1>
          <p className="font-display text-xs text-muted-foreground">
            {DIFFICULTIES[difficultyIndex].label} MODE
          </p>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-xs text-muted-foreground mb-1">
              FINAL SCORE
            </span>
            <span className="font-display text-2xl text-primary text-shadow-glow">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <span className="font-display text-xs text-muted-foreground block mb-1">
                ROUND
              </span>
              <span className="font-game text-lg text-foreground">
                {round}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={onRetry}
            className="game-button w-full"
          >
            RETRY
          </button>
          <button
            onClick={onMenu}
            className="game-button-secondary w-full"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
