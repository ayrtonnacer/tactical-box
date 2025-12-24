import { Coffee, Globe } from 'lucide-react';

interface MenuScreenProps {
  onStartGame: () => void;
  bestRound: number;
}

export function MenuScreen({ onStartGame, bestRound }: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative">
      {/* Title */}
      <div className="mb-16 text-center">
        <h1 className="text-2xl md:text-3xl text-foreground mb-4">
          RTS TRAINER
        </h1>
        <p className="text-xs text-foreground/60 max-w-xs">
          Train your unit selection precision for RTS games
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

      {/* Credits */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] text-foreground/50 mb-3">
          Project by <span className="text-foreground/70">@ayrtonnacer</span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://cafecito.app/ayrtonnacer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            <Coffee className="w-3 h-3" />
            Invitame un cafecito
          </a>
          <a
            href="https://ayrtonnacer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Website
          </a>
        </div>
      </div>
    </div>
  );
}
