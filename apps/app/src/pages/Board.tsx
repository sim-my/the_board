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

// Module-level persistent storage that survives component remounts
const persistentSlotMap = new Map<string, number>();
let hasInitialized = false;

export default function Board({ events, loading, error, onOpenEvent }: BoardProps) {  const [zoom, setZoom] = useState(0.36);
  const [pan, setPan] = useState({ x: 0, y: 24 }); // 24px offset to account for removed top padding
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchStartZoom, setPinchStartZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const ROWS = 4;
  const COLUMNS = 10;
  const MAX_POSTERS = ROWS * COLUMNS;

  // Local state that syncs with persistent map for reactivity
  const [eventSlotMap, setEventSlotMap] = useState<Map<string, number>>(persistentSlotMap);

  // Calculate weight for a slot based on distance from center
  const getSlotWeight = (index: number) => {
    const row = Math.floor(index / COLUMNS);
    const col = index % COLUMNS;
    
    // Center of the board
    const centerRow = (ROWS - 1) / 2;
    const centerCol = (COLUMNS - 1) / 2;
    
    const rowDist = Math.abs(row - centerRow) / centerRow;
    const colDist = Math.abs(col - centerCol) / centerCol;
    const distance = Math.sqrt(rowDist * rowDist + colDist * colDist);
    
    const baseWeight = 0.3; // Minimum weight for variability
    const centerBonus = (1 - Math.min(distance, 1)) * 2.7; // Up to 2.7x bonus for center
    
    return baseWeight + centerBonus;
  };

  // Generate slot assignments once when events first load
  useEffect(() => {
    if (events.length === 0) return;
    
    const eventsWithPosters = events.filter(e => e && e.posterUrl).slice(0, MAX_POSTERS);
    if (eventsWithPosters.length === 0) return;
    
    // Check if we already have assignments for all current events
    const allEventsHaveSlots = eventsWithPosters.every(event => persistentSlotMap.has(event.id));
    
    // Only generate if we haven't initialized or if we have new events without slots
    if (hasInitialized && allEventsHaveSlots) {
      // Sync local state with persistent map
      setEventSlotMap(new Map(persistentSlotMap));
      return;
    }
    
    // Generate initial weighted random assignment
    const availableSlots = Array.from({ length: MAX_POSTERS }, (_, i) => i);
    
    // Only assign slots to events that don't have them yet
    eventsWithPosters.forEach((event) => {
      if (persistentSlotMap.has(event.id)) return; // Skip if already assigned
      
      // Filter out already assigned slots
      const assignedSlots = new Set(Array.from(persistentSlotMap.values()));
      const available = availableSlots.filter(slot => !assignedSlots.has(slot));
      if (available.length === 0) return;
      
      const weights = available.map(slot => getSlotWeight(slot));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;
      
      for (let j = 0; j < available.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      persistentSlotMap.set(event.id, available[selectedIndex]);
    });
    
    hasInitialized = true;
    // Sync local state with persistent map
    setEventSlotMap(new Map(persistentSlotMap));
  }, [events, MAX_POSTERS]);

  const getPosterTransform = (index: number) => {
    const seed = index * 7 + 13;
    const verticalOffset = ((seed % 40) - 20) / 2; // -10px to +10px
    const horizontalOffset = (((seed * 3) % 30) - 15) / 2; // -7.5px to +7.5px
    const rotation = ((seed * 5) % 8) - 4; // -4deg to +4deg

    return {
      transform: `translate(${horizontalOffset}px, ${verticalOffset}px) rotate(${rotation}deg)`,
    };
  };

  // Pin color definitions
  const pinColors = [
    { name: 'red', gradient: ['#dc2626', '#b91c1c'], shadow: '#991b1b' },
    { name: 'blue', gradient: ['#2563eb', '#1e40af'], shadow: '#1e3a8a' },
    { name: 'green', gradient: ['#16a34a', '#15803d'], shadow: '#166534' },
    { name: 'yellow', gradient: ['#eab308', '#ca8a04'], shadow: '#a16207' },
    { name: 'pink', gradient: ['#ec4899', '#db2777'], shadow: '#be185d' },
  ];

  // Get two different pin colors for a poster based on index
  const getPinColors = (index: number) => {
    const seed = index * 11 + 17;
    const color1Index = seed % pinColors.length;
    let color2Index = (seed * 3) % pinColors.length;
    // Ensure the two colors are different
    while (color2Index === color1Index) {
      color2Index = (color2Index + 1) % pinColors.length;
    }
    return [pinColors[color1Index], pinColors[color2Index]];
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

  // Calculate grid position for each poster based on its index
  const getGridPosition = (index: number) => {
    const row = Math.floor(index / COLUMNS);
    const col = index % COLUMNS;
    const cellWidth = 256 + 24; // 256px width + 1.5rem gap
    const cellHeight = 360 + 24; // 360px height + 1.5rem gap
    return {
      left: `${col * cellWidth}px`,
      top: `${row * cellHeight}px`,
    };
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
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
        className="p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          transformOrigin: "center center",
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${COLUMNS * (256 + 24)}px`,
          height: `${ROWS * (360 + 24)}px`,
          touchAction: 'none',
          backgroundImage: 'url(/pins/granite-texture.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {events.slice(0, MAX_POSTERS).map((event) => {
          // Only render if event has a poster and a slot assignment
          if (!event || !event.posterUrl || !eventSlotMap.has(event.id)) {
            return null;
          }

          // Use persistent slot index for positioning, transforms, and colors
          const slotIndex = eventSlotMap.get(event.id)!;
          const gridPos = getGridPosition(slotIndex);
          const transform = getPosterTransform(slotIndex);
          const [pinColor1, pinColor2] = getPinColors(slotIndex);

          return (
            <div
              key={event.id}
              onClick={() => onOpenEvent(event.id)}
              className="bg-white border rounded shadow p-4 w-64 h-[360px] cursor-pointer hover:shadow-lg absolute"
              style={{
                ...gridPos,
                ...transform,
              }}
            >
              {/* Top left pin */}
              <div
                className="absolute z-10"
                style={{
                  top: '8px',
                  left: '8px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${pinColor1.gradient[0]} 0%, ${pinColor1.gradient[1]} 100%)`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '6px',
                    background: pinColor1.shadow,
                    borderRadius: '0 0 1px 1px',
                  }}
                />
              </div>
              
              {/* Top right pin */}
              <div
                className="absolute z-10"
                style={{
                  top: '8px',
                  right: '8px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${pinColor2.gradient[0]} 0%, ${pinColor2.gradient[1]} 100%)`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '6px',
                    background: pinColor2.shadow,
                    borderRadius: '0 0 1px 1px',
                  }}
                />
              </div>

              <div className="h-full flex flex-col">
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="flex-1 w-full object-cover rounded"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {event.title && (
                  <p className="font-semibold text-sm mt-2 line-clamp-2">{event.title}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
