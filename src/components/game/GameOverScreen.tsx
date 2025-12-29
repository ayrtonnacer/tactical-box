import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface GameOverScreenProps {
  round: number;
  bestRound: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  round,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  const handleShare = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit',
      year: 'numeric'
    });
    
    const shareText = `I reached Round ${round} in RTS Trainer on ${dateStr}! Can you beat my score? https://ayrtonnacer.github.io/rts-trainer/`;
    
    navigator.clipboard.writeText(shareText);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center w-full max-w-md">
        {/* Game Over */}
        <div className="text-6xl md:text-7xl font-bold mb-8 text-foreground font-display">
          GAME OVER
        </div>
        
        {/* Round Reached */}
        <div className="mb-12">
          <div className="text-xs md:text-sm mb-4 text-foreground/80 font-display tracking-wider">
            ROUND REACHED
          </div>
          <div className="text-8xl md:text-9xl font-bold text-foreground font-display">
            {round}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-12">
          <button 
            onClick={handleShare}
            className="game-button px-8 py-4 text-sm md:text-base font-display flex items-center justify-center gap-2 font-bold"
          >
            <Copy className="w-5 h-5" />
            SHARE WITH FRIENDS
          </button>
          
          <button 
            onClick={onRetry}
            className="game-button px-8 py-4 text-sm md:text-base font-display font-bold"
          >
            RETRY
          </button>
          
          <button 
            onClick={onMenu}
            className="game-button-secondary px-8 py-4 text-sm md:text-base font-display font-bold"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
