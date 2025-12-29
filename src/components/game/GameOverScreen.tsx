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
        copyToClipboard(shareText, shareUrl);
      }
    } else {
      copyToClipboard(shareText, shareUrl);
    }
  };

  const copyToClipboard = (text: string, url: string) => {
    const fullText = `${text}\n${url}`;
    navigator.clipboard.writeText(fullText);
    toast('Copied to clipboard! Share with friends.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center w-full max-w-md">
        {/* Game Over */}
        <div className="text-xl text-foreground mb-8">GAME OVER</div>
        
        {/* Round Reached */}
        <div className="mb-6">
          <div className="text-[10px] text-foreground/60 mb-2">ROUND REACHED</div>
          <div className="text-5xl text-foreground font-bold">{round}</div>
        </div>

        {/* Best Round */}
        {bestRound > 0 && (
          <div className="mb-8 text-sm text-foreground/70">
            <span>Best Round: </span>
            <span className="font-semibold">{bestRound}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-12">
          <button 
            onClick={handleShare} 
            className="game-button px-8 py-4 text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
          >
            <Share2 className="w-5 h-5" />
            SHARE WITH FRIENDS
          </button>
          
          <button 
            onClick={onRetry} 
            className="game-button px-8 py-4 text-sm bg-white text-blue-600 font-bold rounded hover:bg-gray-100"
          >
            RETRY
          </button>
          
          <button 
            onClick={onMenu} 
            className="game-button-secondary px-8 py-4 text-sm bg-gray-700 text-white font-bold rounded hover:bg-gray-600"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
