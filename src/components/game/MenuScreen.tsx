interface MenuScreenProps {
  onStartGame: () => void;
  bestRound: number;
}

export function MenuScreen({ onStartGame, bestRound }: MenuScreenProps) {
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

      {/* Best Round */}
      {bestRound > 0 && (
        <div className="mb-8 text-center">
          <span className="font-display text-xs text-muted-foreground">BEST ROUND</span>
          <div className="font-display text-4xl text-primary text-shadow-glow">
            {bestRound}
          </div>
        </div>
      )}

      {/* Play Button */}
      <button
        onClick={onStartGame}
        className="game-button text-lg px-12 py-4 mb-12"
      >
        PLAY
      </button>

      {/* Instructions */}
      <div className="max-w-md text-center space-y-4">
        <h3 className="font-display text-xs text-muted-foreground">HOW TO PLAY</h3>
        <div className="font-game text-sm text-muted-foreground space-y-2">
          <p>
            <span className="text-primary">●</span> Click & drag to create a selection box
          </p>
          <p>
            <span className="text-primary">●</span> Capture all <span className="text-primary">yellow</span> circles
          </p>
          <p>
            <span className="text-secondary">●</span> Avoid <span className="text-secondary">white</span> circles
          </p>
          <p>
            <span className="text-destructive">♥</span> Survive as many rounds as possible!
          </p>
        </div>
      </div>
    </div>
  );
}
