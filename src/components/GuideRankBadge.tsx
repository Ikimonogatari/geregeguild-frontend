import { GUIDE_MEDAL } from "@/lib/journeys";
import type { GuideLevel } from "@/lib/guides";

type Props = {
  level: GuideLevel;
  size?: "sm" | "md" | "lg";
  withName?: boolean;
};

const SIZE = {
  sm: { d: 28, font: 11, name: "text-[10px]" },
  md: { d: 40, font: 14, name: "text-[12px]" },
  lg: { d: 56, font: 18, name: "text-[13px]" },
};

/** The gerege medal — a guild rank tablet, game-rank styled. */
export default function GuideRankBadge({ level, size = "md", withName = false }: Props) {
  const medal = GUIDE_MEDAL[level];
  const s = SIZE[size];

  return (
    <div className="flex items-center gap-2.5">
      <span
        className="relative inline-flex items-center justify-center rounded-full font-heading shrink-0"
        title={`${medal.name} · ${level}`}
        style={{
          width: s.d,
          height: s.d,
          background: `radial-gradient(120% 120% at 50% 25%, ${medal.fill} 0%, #1a0f07 100%)`,
          border: `2px solid ${medal.ring}`,
          boxShadow: `0 0 14px -3px ${medal.ring}, inset 0 0 8px rgba(0,0,0,0.6)`,
          color: medal.text,
          fontSize: s.font,
          letterSpacing: "0.04em",
        }}
      >
        {medal.sigil}
      </span>
      {withName && (
        <span className="flex flex-col leading-tight">
          <span
            className={`font-accent uppercase tracking-[0.22em] ${s.name}`}
            style={{ color: medal.ring }}
          >
            {medal.name}
          </span>
          <span className="font-accent italic text-muted text-[10px] tracking-[0.15em] uppercase">
            {level}
          </span>
        </span>
      )}
    </div>
  );
}
