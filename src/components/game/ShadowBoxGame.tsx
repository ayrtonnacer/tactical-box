import { useGameLogic } from '@/hooks/useGameLogic';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { MenuScreen } from './MenuScreen';
import { GameOverScreen } from './GameOverScreen';

export function ShadowBoxGame() {
  const {
    gameState,
    setGameState,
    difficultyIndex,
    circles,
    health,
    maxHealth,
    hearts,
    timer,
    score,
    combo,
    round,
    selectionBox,
    setSelectionBox,
    scorePopups,
    shakeScreen,
    startGame,
    handleSelectionComplete,
    updateCanvasSize,
  } = useGameLogic();

  if (gameState === 'menu') {
    return <MenuScreen onStartGame={startGame} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen
        score={score}
        round={round}
        difficultyIndex={difficultyIndex}
        onRetry={() => startGame(difficultyIndex)}
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
        score={score}
        combo={combo}
        round={round}
      />
      
      <GameCanvas
        circles={circles}
        selectionBox={selectionBox}
        setSelectionBox={setSelectionBox}
        onSelectionComplete={handleSelectionComplete}
        scorePopups={scorePopups}
        shakeScreen={shakeScreen}
        onResize={updateCanvasSize}
      />

      {/* Pause hint */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <span className="font-game text-xs text-muted-foreground/50">
          Select all yellow circles without touching white ones
        </span>
      </div>
    </div>
  );
}
