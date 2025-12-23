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
    health,
    maxHealth,
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
        health={health}
        maxHealth={maxHealth}
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

      {/* Hint */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <span className="font-game text-xs text-muted-foreground/50">
          Select all yellow circles
        </span>
      </div>
    </div>
  );
}
