import { Coffee } from 'lucide-react';

interface MenuScreenProps {
  onStartGame: () => void;
  bestRound: number;
}

export function MenuScreen({ onStartGame, bestRound }: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 md:p-8 bg-background">
      {/* Top spacer */}
      <div className="flex-shrink-0" />

      {/* Main content */}
      <div className="flex flex-col items-center">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
            RTS TRAINER
          </h1>
          <p className="text-[10px] md:text-xs text-foreground/70 font-display tracking-wider leading-relaxed">
            Train your unit selection<br />
            precision for RTS games
          </p>
        </div>

        {/* Best Round */}
        {bestRound > 0 && (
          <div className="mb-8 text-center">
            <div className="text-xs md:text-sm text-foreground/80 mb-2 font-display tracking-wider">
              BEST
            </div>
            <div className="text-5xl md:text-6xl font-bold text-foreground font-display">
              {bestRound}
            </div>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={onStartGame}
          className="game-button mb-8 px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold font-display"
        >
          START
        </button>

        {/* Instructions */}
        <div className="text-[10px] md:text-xs text-foreground/60 text-center space-y-2 font-display tracking-wider">
          <p>SELECT . SOLID CIRCLES</p>
          <p>AVOID . HOLLOW CIRCLES</p>
        </div>
      </div>

      {/* Credits */}
      <div className="flex-shrink-0 text-center mt-8 pb-2">
        <p className="text-[10px] md:text-xs text-foreground/50 mb-2 font-display">
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
          className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-foreground/50 hover:text-foreground/80 transition-colors font-display"
        >
          <Coffee className="w-3 h-3 md:w-4 md:h-4" />
          Invitame un cafecito
        </a>
      </div>
    </div>
  );
}
