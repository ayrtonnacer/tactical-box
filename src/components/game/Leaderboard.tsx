import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  highlightPosition?: number;
}

export function Leaderboard({ entries, highlightPosition }: LeaderboardProps) {
  // Fill empty slots to always show 10 rows
  const displayEntries = [...entries];
  while (displayEntries.length < 10) {
    displayEntries.push({ name: '---', round: 0, timestamp: 0 });
  }

  return (
    <div className="w-full max-w-xs">
      <div className="text-[10px] text-foreground/60 mb-3 text-center">
        HIGH SCORES
      </div>
      
      <div className="space-y-1 font-mono text-sm">
        {displayEntries.map((entry, index) => {
          const isHighlighted = highlightPosition === index + 1;
          const isEmpty = entry.name === '---';
          
          return (
            <div
              key={`${entry.timestamp}-${index}`}
              className={`flex items-center justify-between px-3 py-1 rounded transition-colors ${
                isHighlighted 
                  ? 'bg-primary/20 text-primary' 
                  : isEmpty 
                    ? 'text-foreground/30' 
                    : 'text-foreground/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-right">{index + 1}.</span>
                <span className={isHighlighted ? 'animate-pulse' : ''}>
                  {entry.name}
                </span>
              </div>
              <span>{isEmpty ? '-' : entry.round}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
