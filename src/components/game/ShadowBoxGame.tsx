import { useGameLogic } from '@/hooks/useGameLogic';
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

  if (gameState === 'menu') {
    return <MenuScreen onStartGame={startGame} bestRound={bestRound} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen
        round={round}
        bestRound={bestRound}
        onRetry={startGame}
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
