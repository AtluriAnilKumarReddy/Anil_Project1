import { useEffect, useRef } from 'react';

const SPACING = 24;
const RADIUS = 6;
const AMPLITUDE = 1.5;
const SPEED = 0.05;
const MAX_DISTANCE = 100;
const COLOR_ARRAY = ["#D84315", "#FF8F00", "#8D6E63", "#4E342E"];
const BKG_COLOR = "#FFF8F0";

interface Dot {
  x: number;
  y: number;
  ix: number;
  iy: number;
  baseRadius: number;
  color: string;
  offset: number;
}

interface MouseState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

function createDot(ix: number, iy: number): Dot {
  const baseRadius = RADIUS;
  const color = COLOR_ARRAY[(ix + iy) % COLOR_ARRAY.length];
  const offset = Math.sin(ix * 0.5 + iy * 0.3) * Math.PI;
  const isOddRow = iy % 2 === 1;

  let x = ix * SPACING + SPACING / 2;
  if (isOddRow) {
    x += SPACING / 2;
  }

  const y = iy * SPACING + SPACING / 2 + (isOddRow ? SPACING / 4 : 0);

  return { x, y, ix, iy, baseRadius, color, offset };
}

function initDots(w: number, h: number): { dots: Dot[]; cols: number; rows: number } {
  const cols = Math.ceil(w / SPACING);
  const rows = Math.ceil(h / SPACING);
  const dots: Dot[] = [];

  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      dots.push(createDot(ix, iy));
    }
  }

  return { dots, cols, rows };
}

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const dotsRef = useRef<Dot[]>([]);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.scale(dpr, dpr);

      const result = initDots(w, h);
      dotsRef.current = result.dots;
    }

    function updateMouse(newX: number, newY: number, isActive: boolean) {
      const mouse = mouseRef.current;
      if (!isActive) {
        mouse.active = false;
        return;
      }
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x = newX;
      mouse.y = newY;
      mouse.active = true;
      mouse.vx = newX - prevX;
      mouse.vy = newY - prevY;
    }

    function render() {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      timeRef.current += SPEED;
      const timeSpeed = timeRef.current * 0.5;
      const mouse = mouseRef.current;

      ctx!.fillStyle = BKG_COLOR;
      ctx!.fillRect(0, 0, w, h);

      for (const dot of dotsRef.current) {
        let dx = 0;
        let dy = 0;
        let dist = Infinity;

        if (mouse.active) {
          dx = dot.x - mouse.x;
          dy = dot.y - mouse.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        const breath = Math.sin(timeSpeed + dot.offset) * AMPLITUDE;
        let radius = dot.baseRadius + breath;
        let drawX = dot.x;
        let drawY = dot.y;

        if (mouse.active && dist < MAX_DISTANCE) {
          const force = (MAX_DISTANCE - dist) / MAX_DISTANCE;
          const angle = Math.atan2(dy, dx);
          const push = force * 15;
          radius += Math.sin(force * Math.PI) * 2;
          drawX -= Math.cos(angle) * push;
          drawY -= Math.sin(angle) * push;
        }

        ctx!.fillStyle = dot.color;
        ctx!.beginPath();
        ctx!.arc(drawX, drawY, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      updateMouse(e.clientX - rect.left, e.clientY - rect.top, true);
    };

    const handleMouseLeave = () => {
      updateMouse(0, 0, false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      updateMouse(touch.clientX - rect.left, touch.clientY - rect.top, true);
    };

    const handleTouchEnd = () => {
      updateMouse(0, 0, false);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    resize();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animated dot pattern"
        style={{ display: 'block' }}
      />
    </div>
  );
}
