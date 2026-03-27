import React, { useRef, useState, MouseEvent } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = "", glowColor = "rgba(99, 102, 241, 0.4)" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Invert X axis for correct tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out transform-gpu ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none z-0"
          style={{
             opacity: isHovered ? 1 : 0,
             background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
             filter: 'blur(20px)',
             transform: 'translateZ(-20px)'
          }}
        />
        <div className="relative z-10 h-full">
           {children}
        </div>
        
        {/* Gloss overlay */}
        <div 
            className="absolute inset-0 rounded-2xl pointer-events-none z-20 mix-blend-overlay"
            style={{
                background: `linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)`,
                opacity: isHovered ? 0.3 : 0,
                transition: 'opacity 0.3s ease'
            }}
        />
      </div>
    </div>
  );
};