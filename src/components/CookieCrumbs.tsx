import { useEffect, useRef, useCallback } from "react";

interface Crumb {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  'hsla(30, 60%, 45%, 0.8)',   // dark brown
  'hsla(35, 70%, 55%, 0.7)',   // golden brown
  'hsla(25, 50%, 35%, 0.6)',   // chocolate
  'hsla(40, 80%, 65%, 0.7)',   // light golden
  'hsla(20, 40%, 30%, 0.5)',   // deep brown
];

const CookieCrumbs = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crumbsRef = useRef<Crumb[]>([]);
  const idRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>();

  const spawnCrumbs = useCallback((x: number, y: number) => {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const maxLife = 40 + Math.random() * 40;
      crumbsRef.current.push({
        id: idRef.current++,
        x,
        y,
        size: 1.5 + Math.random() * 3,
        vx: -1.5 + Math.random() * 3,
        vy: 0.5 + Math.random() * 2,
        rotation: Math.random() * 360,
        rotationSpeed: -3 + Math.random() * 6,
        opacity: 0.5 + Math.random() * 0.4,
        life: 0,
        maxLife,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    // Limit particles
    if (crumbsRef.current.length > 80) {
      crumbsRef.current = crumbsRef.current.slice(-60);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 8) {
        spawnCrumbs(e.clientX, e.clientY);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      crumbsRef.current = crumbsRef.current.filter(c => c.life < c.maxLife);
      
      for (const c of crumbsRef.current) {
        c.life++;
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.06; // gravity
        c.vx *= 0.99;
        c.rotation += c.rotationSpeed;
        
        const progress = c.life / c.maxLife;
        const alpha = c.opacity * (1 - progress);
        const scale = 1 - progress * 0.3;
        
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        
        // Draw irregular crumb shape
        ctx.fillStyle = c.color;
        ctx.beginPath();
        const s = c.size * scale;
        // Irregular polygon for crumb look
        ctx.moveTo(s, 0);
        ctx.lineTo(s * 0.5, s * 0.8);
        ctx.lineTo(-s * 0.3, s * 0.6);
        ctx.lineTo(-s, s * 0.1);
        ctx.lineTo(-s * 0.7, -s * 0.5);
        ctx.lineTo(0, -s * 0.7);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
      
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spawnCrumbs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default CookieCrumbs;
