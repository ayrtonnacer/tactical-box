interface MenuScreenProps {
  onStartGame: () => void;
  bestRound: number;
}

export function MenuScreen({ onStartGame, bestRound }: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      {/* Title */}
      <div className="mb-16 text-center">
        <h1 className="text-2xl md:text-3xl text-foreground mb-6">
          SHADOWBOX
        </h1>
        <p className="text-[10px] text-foreground/60 tracking-widest">
          RTS TRAINER
        </p>
      </div>

      {/* Best Round */}
      {bestRound > 0 && (
        <div className="mb-10 text-center">
          <div className="text-[10px] text-foreground/60 mb-2">BEST</div>
          <div className="text-3xl text-foreground">{bestRound}</div>
        </div>
      )}

      {/* Play Button */}
      <button
        onClick={onStartGame}
        className="game-button mb-16"
      >
        START
      </button>

      {/* Instructions - minimal */}
      <div className="text-[8px] text-foreground/50 text-center space-y-3 max-w-xs">
        <p>SELECT ● SOLID CIRCLES</p>
        <p>AVOID ○ HOLLOW CIRCLES</p>
      </div>
    </div>
  );
}
