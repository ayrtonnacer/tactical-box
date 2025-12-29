import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Leaderboard } from './Leaderboard';
import { NameInput } from './NameInput';

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
  const { leaderboard, isHighScore, getScorePosition, addEntry } = useLeaderboard();
  const [showNameInput, setShowNameInput] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<number | undefined>();

  const qualifiesForLeaderboard = isHighScore(round);
  const scorePosition = getScorePosition(round);

  useEffect(() => {
    // Show name input if qualifies and hasn't submitted yet
    if (qualifiesForLeaderboard && !hasSubmitted && round > 0) {
      setShowNameInput(true);
    }
  }, [qualifiesForLeaderboard, hasSubmitted, round]);

  const handleNameSubmit = (name: string) => {
    addEntry(name, round);
    setShowNameInput(false);
    setHasSubmitted(true);
    setHighlightPosition(scorePosition);
  };

  const handleShare = async () => {
    const shareText = `I reached Round ${round} in RTS Trainer! Train your unit selection precision for RTS games.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RTS Trainer - Unit Selection Precision',
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
      <div className="text-center w-full max-w-md">
        {/* Game Over */}
        <div className="text-xl text-foreground mb-8">
          GAME OVER
        </div>

        {/* Round Reached */}
        <div className="mb-6">
          <div className="text-[10px] text-foreground/60 mb-2">ROUND</div>
          <div className="text-5xl text-foreground">{round}</div>
        </div>

        {/* Name Input or Leaderboard */}
        {showNameInput ? (
          <div className="my-8">
            <NameInput onSubmit={handleNameSubmit} position={scorePosition} />
          </div>
        ) : (
          <div className="my-8 flex justify-center">
            <Leaderboard entries={leaderboard} highlightPosition={highlightPosition} />
          </div>
        )}

        {/* Actions */}
        {!showNameInput && (
          <div className="flex flex-col gap-4 mt-8">
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
        )}
      </div>
    </div>
  );
}
