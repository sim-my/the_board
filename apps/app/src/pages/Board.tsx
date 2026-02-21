import { useState, useRef, useEffect } from "react";
import type { EventItem } from "../App";

type Poster = {
  id: string;
  title: string;
  events: EventItem[];
};

type BoardProps = {
  events: EventItem[];
  loading?: boolean;
  error?: string;
  onOpenEvent: (id: string) => void;
};

export default function Board({ events, loading, error, onOpenEvent }: BoardProps) {  const [zoom, setZoom] = useState(0.36);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchStartZoom, setPinchStartZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const ROWS = 4;
  const COLUMNS = 10;
  const MAX_POSTERS = ROWS * COLUMNS;

  const getPosterTransform = (index: number) => {
    const seed = index * 7 + 13;
    const verticalOffset = ((seed % 40) - 20) / 2; // -10px to +10px
    const horizontalOffset = (((seed * 3) % 30) - 15) / 2; // -7.5px to +7.5px
    const rotation = ((seed * 5) % 8) - 4; // -4deg to +4deg

    return {
      transform: `translate(${horizontalOffset}px, ${verticalOffset}px) rotate(${rotation}deg)`,
    };
  };

  // Calculate distance between two touches
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastPan(pan);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setPan({
      x: lastPan.x + deltaX,
      y: lastPan.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch drag and pinch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(e.touches[0], e.touches[1]);
      setPinchStartDistance(distance);
      setPinchStartZoom(zoom);
    } else if (e.touches.length === 1) {
      // Single touch drag
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastPan(pan);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistance !== null) {
      // Pinch zoom
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchStartDistance;
      const newZoom = Math.max(0.25, Math.min(2, pinchStartZoom * scale));
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setPan({
        x: lastPan.x + deltaX,
        y: lastPan.y + deltaY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPinchStartDistance(null);
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prevZoom) => Math.max(0.25, Math.min(2, prevZoom * delta)));
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setPan({
          x: lastPan.x + deltaX,
          y: lastPan.y + deltaY,
        });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, lastPan]);

  const posters = events.slice(0, MAX_POSTERS);

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      <div className="fixed bottom-4 right-4 flex items-center gap-3 z-10 bg-white/90 border rounded px-4 py-2 shadow-sm">
        <span className="text-sm font-medium min-w-[50px]">{Math.round(zoom * 100)}%</span>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.01"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-32"
        />
      </div>
      <div
        className="p-6 bg-[#b07840]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          transformOrigin: "center center",
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 256px)`,
          gridTemplateRows: `repeat(${ROWS}, 360px)`,
          gap: "1.5rem",
          width: "fit-content",
          height: "fit-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          touchAction: 'none'
        }}
      >
        {Array.from({ length: MAX_POSTERS }).map((_, index) => {
          const event = posters[index];
          const transform = getPosterTransform(index);

          return (
            <div
              key={event?.id || `empty-${index}`}
              onClick={() => event && onOpenEvent(event.id)}
              className="bg-white border rounded shadow p-4 w-64 h-[360px] cursor-pointer hover:shadow-lg transition"
              style={{ ...transform }}
            >
              {event ? (
                <>
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="h-48 w-full object-cover rounded mb-2"
                  />
                  <p className="font-semibold text-sm">{event.title}</p>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
