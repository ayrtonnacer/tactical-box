import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleShare = async () => {
    const shareText = `I reached Round ${round} in RTS Trainer! Can you beat my score?`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RTS Trainer',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text + ' ' + window.location.href);
    toast('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center">
        {/* Game Over */}
        <div className="text-xl text-foreground mb-12">
          GAME OVER
        </div>

        {/* Round Reached */}
        <div className="mb-8">
          <div className="text-[10px] text-foreground/60 mb-2">ROUND</div>
          <div className="text-5xl text-foreground">{round}</div>
          {isNewBest && (
            <div className="text-[10px] text-foreground/80 mt-4">* NEW BEST *</div>
          )}
        </div>

        {/* Best */}
        {!isNewBest && bestRound > 0 && (
          <div className="text-[10px] text-foreground/50 mb-12">
            BEST: {bestRound}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-12">
          <button onClick={onRetry} className="game-button">
            RETRY
          </button>
          
          <button 
            onClick={handleShare} 
            className="game-button-secondary px-8 py-4 text-xs flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            SHARE
          </button>
          
          <button onClick={onMenu} className="game-button-secondary px-8 py-4 text-xs">
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
