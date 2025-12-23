import { useRef, useState, useEffect, useCallback } from 'react';
import { Circle, SelectionBox } from '@/types/game';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCanvasProps {
  circles: Circle[];
  selectionBox: SelectionBox | null;
  setSelectionBox: (box: SelectionBox | null) => void;
  onSelectionComplete: (box: SelectionBox) => void;
  shakeScreen: boolean;
  onResize: (width: number, height: number) => void;
}

export function GameCanvas({
  circles,
  selectionBox,
  setSelectionBox,
  onSelectionComplete,
  shakeScreen,
  onResize,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        onResize(entry.contentRect.width, entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  const getMousePos = useCallback((e: React.MouseEvent | MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setIsDragging(true);
    setStartPos(pos);
    setSelectionBox({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
  }, [getMousePos, setSelectionBox]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const pos = getMousePos(e);
    setSelectionBox({
      x1: startPos.x,
      y1: startPos.y,
      x2: pos.x,
      y2: pos.y,
    });
  }, [isDragging, getMousePos, startPos, setSelectionBox]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !selectionBox) return;
    
    setIsDragging(false);
    onSelectionComplete(selectionBox);
    setSelectionBox(null);
  }, [isDragging, selectionBox, onSelectionComplete, setSelectionBox]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && selectionBox) {
      setIsDragging(false);
      onSelectionComplete(selectionBox);
      setSelectionBox(null);
    }
  }, [isDragging, selectionBox, onSelectionComplete, setSelectionBox]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "game-canvas w-full h-full cursor-crosshair",
        shakeScreen && "animate-shake"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Circles */}
      {circles.map(circle => (
        <div
          key={circle.id}
          className={cn(
            "circle-base animate-pop-in",
            circle.captured && circle.type === 'bad' && "circle-captured-bad",
            circle.captured && circle.type === 'good' && "circle-captured-good",
            !circle.captured && circle.type === 'good' && "circle-good",
            !circle.captured && circle.type === 'bad' && "circle-bad"
          )}
          style={{
            left: circle.x - circle.radius,
            top: circle.y - circle.radius,
            width: circle.radius * 2,
            height: circle.radius * 2,
          }}
        >
          {/* Show X on captured bad circles */}
          {circle.captured && circle.type === 'bad' && (
            <X className="w-4 h-4 text-foreground" strokeWidth={3} />
          )}
        </div>
      ))}

      {/* Selection Box */}
      {selectionBox && (
        <div
          className="selection-box"
          style={{
            left: Math.min(selectionBox.x1, selectionBox.x2),
            top: Math.min(selectionBox.y1, selectionBox.y2),
            width: Math.abs(selectionBox.x2 - selectionBox.x1),
            height: Math.abs(selectionBox.y2 - selectionBox.y1),
          }}
        />
      )}
    </div>
  );
}
