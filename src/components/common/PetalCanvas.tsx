import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'petal' | 'gold_dust';
  swayOffset: number;
  swaySpeed: number;
}

interface PetalCanvasProps {
  reducedMotion?: boolean;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color tones for realistic velvety rose petals
    const petalColors = [
      'rgba(142, 18, 48, ',  // Deep crimson
      'rgba(176, 24, 60, ',  // Rich ruby
      'rgba(217, 37, 80, ',  // Bright rose
      'rgba(110, 12, 35, ',  // Dark velvet burgundy
    ];

    const particleCount = reducedMotion ? 12 : 36;
    const particles: Particle[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const isGold = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isGold ? Math.random() * 2 + 1 : Math.random() * 12 + 8,
        speedX: (Math.random() - 0.5) * 0.4 + 0.2,
        speedY: isGold ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.7 + 0.35),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: isGold ? Math.random() * 0.6 + 0.2 : Math.random() * 0.55 + 0.25,
        color: isGold
          ? 'rgba(235, 195, 95, '
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        type: isGold ? 'gold_dust' : 'petal',
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.008,
      });
    }

    // Draw single stylized organic rose petal shape
    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.beginPath();

      // Curved petal geometry using bezier curves
      context.moveTo(0, -size);
      context.bezierCurveTo(size * 0.8, -size * 0.7, size * 0.9, size * 0.4, 0, size);
      context.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.8, -size * 0.7, 0, -size);

      context.fillStyle = `${color}${opacity})`;
      context.fill();

      // Subtle delicate petal center vein highlight
      context.strokeStyle = `rgba(255, 210, 220, ${opacity * 0.22})`;
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(0, -size * 0.7);
      context.quadraticCurveTo(size * 0.1, 0, 0, size * 0.7);
      context.stroke();

      context.restore();
    };

    // Draw soft glowing golden particle
    const drawGoldDust = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      context.save();
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fillStyle = `rgba(247, 208, 112, ${opacity})`;
      context.shadowColor = 'rgba(212, 175, 55, 0.8)';
      context.shadowBlur = 8;
      context.fill();
      context.restore();
    };

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          p.swayOffset += p.swaySpeed;
          p.x += Math.sin(p.swayOffset) * 0.5 + p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
        }

        // Wrap around viewport edges smoothly
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
        } else {
          // Soft twinkle variation for gold dust
          const shimmer = p.opacity + Math.sin(tick * 0.05 + i) * 0.15;
          drawGoldDust(ctx, p.x, p.y, p.size, Math.max(0.1, Math.min(1, shimmer)));
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
