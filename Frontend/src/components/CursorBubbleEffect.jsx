import { useEffect, useRef, useState } from 'react';
import '../Styles/CursorBubbleEffect.css';

const MAX_STARS = 40;

export default function CursorBubbleEffect() {
  const [enabled, setEnabled] = useState(false);
  const [stars, setStars] = useState([]);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
    if (!isSmallScreen) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleClick = (e) => {
      const starCount = 6;
      const timestamp = Date.now();
      const newStars = Array.from({ length: starCount }, (_, i) => {
        const angle = (i * (360 / starCount)) + (Math.random() * 20);
        const velocity = 2 + Math.random() * 2;
        const radian = (angle * Math.PI) / 180;
        return {
          id: `spark-${timestamp}-${i}`,
          x: e.clientX,
          y: e.clientY,
          size: 4 + Math.random() * 6,
          driftX: Math.cos(radian) * (velocity * 40),
          driftY: Math.sin(radian) * (velocity * 40),
          duration: 600 + Math.random() * 300,
          color: '#fff'
        };
      });
      setStars((prev) => [...prev, ...newStars].slice(-20));
    };

    let animationId;
    const animate = () => {
      // Smooth interpolation for the ring (stiffness/damping)
      const easing = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * easing;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * easing;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  useEffect(() => {
    if (!stars.length) return;
    const timers = stars.map((star) => setTimeout(() => {
      setStars((prev) => prev.filter((item) => item.id !== star.id));
    }, star.duration));
    return () => timers.forEach(clearTimeout);
  }, [stars]);

  if (!enabled) return null;

  return (
    <div className="cursor-system" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {/* Premium Trailing Components */}
      <div ref={dotRef} className="cursor-dot" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* Subtle Click Sparks */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="click-spark"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--drift-x': `${star.driftX}px`,
            '--drift-y': `${star.driftY}px`,
            '--duration': `${star.duration}ms`,
            backgroundColor: star.color
          }}
        />
      ))}
    </div>
  );
}
