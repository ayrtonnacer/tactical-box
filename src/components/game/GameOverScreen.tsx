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
      <div className="text-center">
        {/* Game Over */}
        <div className="text-xl text-destructive mb-12">
          GAME OVER
        </div>

        {/* Round Reached */}
        <div className="mb-8">
          <div className="text-[10px] text-muted-foreground mb-2">ROUND</div>
          <div className="text-5xl text-primary">{round}</div>
          {isNewBest && (
            <div className="text-[10px] text-accent mt-4">NEW BEST</div>
          )}
        </div>

        {/* Best */}
        {!isNewBest && bestRound > 0 && (
          <div className="text-[10px] text-muted-foreground mb-12">
            BEST: {bestRound}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-12">
          <button onClick={onRetry} className="game-button">
            RETRY
          </button>
          <button onClick={onMenu} className="game-button-secondary px-8 py-4 text-xs">
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
