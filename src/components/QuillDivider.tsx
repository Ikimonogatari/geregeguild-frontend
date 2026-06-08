"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  /** Total width of the stroke in pixels. The SVG scales responsively via className width if you'd rather not pin. */
  width?: number;
};

/**
 * SVG quill-drawn ink stroke that animates in like it's being written.
 * Uses framer-motion pathLength + an ink-blot terminator dot at each end.
 */
export default function QuillDivider({ className, width = 320 }: Props) {
  const w = width;
  const c1x = w * 0.25;
  const c2x = w * 0.75;
  return (
    <motion.svg
      viewBox={`0 0 ${w} 18`}
      width={w}
      height={18}
      className={`quill-stroke ${className ?? ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-hidden
    >
      {/* The stroke — slight waver for hand-drawn feel */}
      <motion.path
        d={`M 6 10 Q ${c1x} 4, ${w / 2} 10 T ${c2x} 10 T ${w - 6} 10`}
        stroke="rgba(201, 146, 42, 0.85)"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.6, ease: [0.2, 0.7, 0.2, 1] },
          },
        }}
      />
      {/* Left ink-blot — already on the page, dot exists when stroke starts */}
      <motion.circle
        cx={6}
        cy={10}
        r={1.6}
        fill="rgba(201, 146, 42, 0.85)"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, delay: 0.1 },
          },
        }}
        style={{ transformOrigin: `6px 10px` }}
      />
      {/* Right ink-blot — splashes once the quill finishes its stroke */}
      <motion.circle
        cx={w - 6}
        cy={10}
        r={1.8}
        fill="rgba(201, 146, 42, 0.95)"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              delay: 1.55,
              ease: [0.2, 0.7, 0.2, 1],
            },
          },
        }}
        style={{ transformOrigin: `${w - 6}px 10px` }}
      />
    </motion.svg>
  );
}
