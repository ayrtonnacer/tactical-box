import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface GameOverScreenProps {
  round: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  round,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  const handleShare = async () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit',
      year: 'numeric'
    });
    
    const shareText = `I reached Round ${round} in RTS Trainer on ${dateStr}! Can you beat my score? https://ayrtonnacer.github.io/rts-trainer/`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RTS Trainer',
          text: shareText,
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard! Share with friends.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#001a66' }}>
      <div className="text-center w-full max-w-md">
        {/* Game Over */}
        <div className="text-4xl font-bold mb-8" style={{ color: '#ffffff', fontFamily: 'monospace', letterSpacing: '3px' }}>
          GAME OVER
        </div>
        
        {/* Round Reached */}
        <div className="mb-8">
          <div className="text-sm mb-4" style={{ color: '#ffffff', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.8 }}>
            ROUND REACHED
          </div>
          <div className="text-8xl font-bold" style={{ color: '#ffffff', fontFamily: 'monospace' }}>
            {round}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-12">
          <button 
            onClick={handleShare} 
            className="px-8 py-4 text-lg font-bold transition-all duration-200"
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#001a66',
              border: '2px solid #ffffff',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <Share2 className="inline w-5 h-5 mr-2" />
            SHARE WITH FRIENDS
          </button>
          
          <button 
            onClick={onRetry} 
            className="px-8 py-4 text-lg font-bold transition-all duration-200"
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#001a66',
              border: '2px solid #ffffff',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            RETRY
          </button>
          
          <button 
            onClick={onMenu} 
            className="px-8 py-4 text-lg font-bold transition-all duration-200"
            style={{ 
              backgroundColor: '#001a66', 
              color: '#ffffff',
              border: '2px solid #ffffff',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#003399';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#001a66';
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
