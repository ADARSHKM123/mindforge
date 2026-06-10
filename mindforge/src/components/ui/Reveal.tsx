import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  /** Set false for above-the-fold content that should animate immediately */
  onScroll?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/** Scroll-reveal wrapper: soft fade-up as content enters the viewport. */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, onScroll = true, style, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    {...(onScroll
      ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } }
      : { animate: { opacity: 1, y: 0 } })}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    style={style}
    className={className}
  >
    {children}
  </motion.div>
);

export default Reveal;
