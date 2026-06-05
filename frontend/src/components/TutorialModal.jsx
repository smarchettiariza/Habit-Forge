import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Flame, Trophy, Zap, CheckCircle, Star } from "lucide-react";

const STEPS = [
  {
    icon: "🔥",
    title: "Bienvenido a HabitForge",
    description: "Tu plataforma para construir hábitos poderosos con gamificación. Cada hábito que completás te acerca a ser la mejor versión de vos mismo.",
    visual: (
      <div className="flex justify-center gap-4 mt-4">
        {["💪", "📚", "🏃", "🧘", "💧"].map((ic, i) => (
          <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "#1a1a26", border: "1px solid #22223a", animationDelay: `${i * 0.1}s` }}>
            {ic}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "✅",
    title: "Check-in diario",
    description: "Cada día marcás tus hábitos como completados. Simple: entrás, hacés click en el botón de cada hábito, y listo. Se reinicia automáticamente cada día.",
    visual: (
      <div className="mt-4 rounded-xl p-4 border" style={{ background: "#1a1a26", borderColor: "#22223a" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <p className="text-white text-sm font-semibold">Hacer ejercicio</p>
              <p className="text-xs opacity-40">salud</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#f97316" }}>
            <CheckCircle size={16} className="text-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "🔥",
    title: "Rachas (Streaks)",
    description: "Completar un hábito días seguidos construye una racha. Cuanto más larga la racha, más XP ganás por cada check-in. ¡No la rompas!",
    visual: (
      <div className="mt-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold`}
              style={{ background: i < 5 ? "#f97316" : "#1a1a26", color: i < 5 ? "white" : "#444" }}>
              {i < 5 ? "✓" : d}
            </div>
            <span className="text-xs opacity-30">D{d}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "⚡",
    title: "XP y Niveles",
    description: "Cada check-in te da XP. Con racha de 3+ días ganás 1.5x, con 7+ días 2x, y con 30+ días ¡3x! Acumulá XP para subir de nivel.",
    visual: (
      <div className="mt-4 space-y-2">
        {[
          { label: "Sin racha", xp: "+10 XP", color: "#888" },
          { label: "3+ días", xp: "+15 XP", color: "#f59e0b" },
          { label: "7+ días", xp: "+20 XP", color: "#f97316" },
          { label: "30+ días", xp: "+30 XP", color: "#ef4444" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: "#1a1a26" }}>
            <div className="flex items-center gap-2">
              <Flame size={14} style={{ color: r.color }} />
              <span className="text-sm opacity-70">{r.label}</span>
            </div>
            <span className="text-sm font-bold" style={{ color: r.color }}>{r.xp}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "🏆",
    title: "Logros",
    description: "Desbloqueás logros automáticamente al alcanzar metas. Cada logro te da XP extra. Visitá la pestaña 'Logros' para ver tu progreso.",
    visual: (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: "🌱", name: "Primer paso", locked: false },
          { icon: "🔥", name: "En racha", locked: false },
          { icon: "⚡", name: "Una semana", locked: true },
          { icon: "💎", name: "Un mes", locked: true },
          { icon: "🏅", name: "Dedicado", locked: true },
          { icon: "🏆", name: "Centurión", locked: true },
        ].map((a, i) => (
          <div key={i} className="rounded-xl p-2 text-center border"
            style={{
              background: "#1a1a26",
              borderColor: !a.locked ? "#f97316" : "#22223a",
              opacity: a.locked ? 0.4 : 1,
            }}>
            <div className="text-xl mb-1">{a.icon}</div>
            <p className="text-xs opacity-60">{a.name}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>

      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border overflow-hidden animate-pop"
        style={{ background: "var(--surface)", borderColor: "#f97316" + "44" }}>

        {/* Orange top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #fbbf24)" }} />

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "6px",
                background: i <= step ? "#f97316" : "#22223a",
              }} />
          ))}
        </div>

        <div className="p-6">
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 opacity-40 hover:opacity-100 transition-all">
            <X size={16} />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="text-5xl mb-3">{current.icon}</div>
            <h2 className="text-xl font-display font-bold text-white mb-2">{current.title}</h2>
            <p className="text-sm opacity-60 leading-relaxed">{current.description}</p>
            {current.visual}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-20 hover:bg-white/5">
              <ChevronLeft size={16} /> Anterior
            </button>

            {isLast ? (
              <button onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <Star size={14} /> ¡Empezar!
              </button>
            ) : (
              <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                Siguiente <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
