"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingItemProps {
  children: React.ReactNode;
  duration?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  className?: string;
}

export function FloatingItem({
  children,
  duration = 20,
  xRange = [-100, 100],
  yRange = [-50, 50],
  className,
}: FloatingItemProps) {
  const xKeyframes = useMemo(
    () => [0, xRange[0], xRange[1], xRange[0], xRange[1], 0],
    [xRange]
  );
  const yKeyframes = useMemo(
    () => [0, yRange[0], yRange[1], yRange[1], yRange[0], 0],
    [yRange]
  );

  return (
    <motion.div
      className={className}
      animate={{
        x: xKeyframes,
        y: yKeyframes,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
