import { useGameLogic } from '@/hooks/useGameLogic';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { MenuScreen } from './MenuScreen';
import { GameOverScreen } from './GameOverScreen';

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
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={toggleMusic}
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
      />
    </div>
  );
}
