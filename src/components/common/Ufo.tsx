"use client";

import { motion } from "framer-motion";

export function Ufo() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: "circOut" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="100"
        viewBox="0 0 200 100"
        className="drop-shadow-[0_0_25px_rgba(128,90,213,0.7)]"
      >
        <ellipse cx="100" cy="60" rx="90" ry="30" fill="url(#ufoGradient)" />
        <ellipse
          cx="100"
          cy="50"
          rx="40"
          ry="20"
          fill="url(#ufoDomeGradient)"
        />
        <motion.ellipse
          cx="100"
          cy="60"
          rx="95"
          ry="35"
          fill="transparent"
          stroke="#EC4899"
          strokeWidth="3"
          animate={{
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <defs>
          <radialGradient id="ufoGradient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#A855F7" /> 
            <stop offset="100%" stopColor="#EC4899" /> 
          </radialGradient>
          <radialGradient id="ufoDomeGradient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(200, 220, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(150, 180, 255, 0.6)" />
          </radialGradient>
        </defs>
        {/* Beam */}
        <motion.path
          d="M 60 85 Q 100 180 140 85 Z"
          fill="rgba(236, 72, 153, 0.3)"
          initial={{ opacity: 0, scaleY: 0, y: -20 }}
          animate={{
            opacity: [0, 0.7, 0, 0.6, 0],
            scaleY: [0, 1, 0.8, 1, 0],
            y: [-20, 0, 0, 0, -20],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top center" }}
        />
      </svg>
    </motion.div>
  );
}
