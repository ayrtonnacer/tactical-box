import { Coffee } from 'lucide-react';

interface MenuScreenProps {
  onStartGame: () => void;
  bestRound: number;
}

export function MenuScreen({ onStartGame, bestRound }: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-display">
          RTS TRAINER
        </h1>
        <p className="text-xs md:text-sm text-foreground/70 max-w-xs font-display tracking-widest">
          Train your unit selection<br />
          precision for RTS games
        </p>
      </div>

      {/* Best Round */}
      {bestRound > 0 && (
        <div className="mb-12 text-center">
          <div className="text-sm md:text-base text-foreground/80 mb-4 font-display tracking-wider">
            BEST
          </div>
          <div className="text-7xl md:text-8xl font-bold text-foreground font-display">
            {bestRound}
          </div>
        </div>
      )}

      {/* Play Button */}
      <button
        onClick={onStartGame}
        className="game-button mb-16 px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold font-display"
      >
        START
      </button>

      {/* Instructions */}
      <div className="text-xs md:text-sm text-foreground/60 text-center space-y-3 max-w-xs font-display tracking-widest">
        <p>SELECT . SOLID CIRCLES</p>
        <p>AVOID . HOLLOW CIRCLES</p>
      </div>

      {/* Credits */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs md:text-sm text-foreground/50 mb-3 font-display">
          Project by{' '}
          <a
            href="https://ayrtonnacer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground/90 transition-colors"
          >
            @ayrtonnacer
          </a>
        </p>
        <a
          href="https://cafecito.app/ayrtonnacer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm text-foreground/50 hover:text-foreground/80 transition-colors font-display"
        >
          <Coffee className="w-4 h-4" />
          Invitame un cafecito
        </a>
      </div>
    </div>
  );
}
