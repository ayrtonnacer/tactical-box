import { memo } from 'react';
import { ShadowBoxGame } from '@/components/game/ShadowBoxGame';
import { SpotifyPlayer } from '@/components/SpotifyPlayer';

// Memoize SpotifyPlayer to prevent re-renders
const MemoizedSpotifyPlayer = memo(SpotifyPlayer);

const Index = () => {
  return (
    <>
      <ShadowBoxGame />
      <MemoizedSpotifyPlayer />
    </>
  );
};

export default Index;
