interface GameOverScreenProps {
  round: number;
  bestRound: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  round,
  bestRound,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  const isNewBest = round >= bestRound;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center space-y-8">
        {/* Game Over Title */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-destructive mb-2">
            GAME OVER
          </h1>
        </div>

        {/* Round Reached - Main Metric */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <span className="font-display text-sm text-muted-foreground block mb-2">
            YOU REACHED
          </span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-display text-6xl text-primary text-shadow-glow">
              {round}
            </span>
            <span className="font-display text-xl text-muted-foreground">
              ROUND{round !== 1 ? 'S' : ''}
            </span>
          </div>
          
          {isNewBest && (
            <div className="mt-4 text-accent font-display text-sm animate-pulse">
              ★ NEW BEST! ★
            </div>
          )}
        </div>

        {/* Best Round */}
        {!isNewBest && bestRound > 0 && (
          <div className="text-center">
            <span className="font-display text-xs text-muted-foreground">BEST: </span>
            <span className="font-display text-lg text-primary">{bestRound}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={onRetry}
            className="game-button w-full"
          >
            PLAY AGAIN
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
