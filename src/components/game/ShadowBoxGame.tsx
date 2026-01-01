import { useGameLogic } from '@/hooks/useGameLogic';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { MenuScreen } from './MenuScreen';
import { GameOverScreen } from './GameOverScreen';
import { SpotifyPlayer } from '../SpotifyPlayer';

export function ShadowBoxGame() {
  const {
    gameState,
    setGameState,
    circles,
    hearts,
    timer,
    round,
    bestRound,
    selectionBox,
    setSelectionBox,
    shakeScreen,
    startGame,
    handleSelectionComplete,
    updateCanvasSize,
  } = useGameLogic();

  const { isMusicEnabled, toggleMusic, startMusic } = useBackgroundMusic();

  const handleStartGame = () => {
    startMusic();
    startGame();
  };

  if (gameState === 'menu') {
    return (
      <MenuScreen 
        onStartGame={handleStartGame} 
        bestRound={bestRound}
      />
    );
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen
        round={round}
        bestRound={bestRound}
        onRetry={handleStartGame}
        onMenu={() => setGameState('menu')}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <GameHUD
        hearts={hearts}
        timer={timer}
        round={round}
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={toggleMusic}
      />
      
      <GameCanvas
        circles={circles}
        selectionBox={selectionBox}
        setSelectionBox={setSelectionBox}
        onSelectionComplete={handleSelectionComplete}
        shakeScreen={shakeScreen}
        onResize={updateCanvasSize}
              <SpotifyPlayer />
      />
    </div>
  );
}
