import { Zap } from "lucide-react";

const LEVEL_NAMES = ["", "Principiante", "Constante", "Dedicado", "Enfocado", "Comprometido", "Avanzado", "Experto", "Maestro", "Leyenda", "Mítico"];

export default function XPBar({ xp, level, xpToNext }) {
  const levelName = LEVEL_NAMES[level] || `Nivel ${level}`;
  const xpForThisLevel = xp - getXPFloor(level);
  const xpNeeded = xpForThisLevel + xpToNext;
  const percent = xpNeeded > 0 ? Math.round((xpForThisLevel / xpNeeded) * 100) : 100;

  return (
    <div className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-display"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white" }}>
            {level}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{levelName}</p>
            <p className="text-xs opacity-40">{xp} XP total</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#f97316" }}>
          <Zap size={12} />
          <span>{xpToNext} XP para subir</span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full xp-fill"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #f97316, #fbbf24)",
          }}
        />
      </div>
    </div>
  );
}

function getXPFloor(level) {
  const thresholds = [0, 0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 10000];
  return thresholds[level] || 0;
}
