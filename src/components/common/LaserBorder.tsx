// src/components/common/LaserBorder.tsx
'use client';

import { motion } from 'framer-motion';

interface LaserBorderProps {
  children: React.ReactNode;
}

const LaserBorder = ({ children }: LaserBorderProps) => {
  return (
    <div className="relative p-[1px] rounded-lg overflow-hidden">
      {/* The animated gradient */}
      <motion.div
        className="absolute top-0 left-0 w-[200%] h-[200%]"
        initial={{ x: '-50%', y: '-50%' }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, transparent 50%, #A855F7, #EC4899, transparent 100%)',
        }}
      />
      {/* The inner content with a black background */}
      <div className="relative z-10 bg-background rounded-[7px]">
        {children}
      </div>
    </div>
  );
};

export default LaserBorder;
