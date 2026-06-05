import { useState } from "react";
import { Flame, Check, Trash2 } from "lucide-react";
import api from "../api/client";
import toast from "react-hot-toast";

export default function HabitCard({ habit, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleCheckin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (habit.completed_today) {
        await api.delete(`/habits/${habit.id}/checkin`);
        toast("Check-in deshecho", { icon: "↩️" });
      } else {
        await api.post(`/habits/${habit.id}/checkin`);
        toast.success(`+XP! 🎯 ${habit.name} completado`);
      }
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Archivar "${habit.name}"?`)) return;
    try {
      await api.delete(`/habits/${habit.id}`);
      toast("Hábito archivado", { icon: "📦" });
      onUpdate();
    } catch {
      toast.error("Error al archivar");
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-300 group ${
        habit.completed_today ? "opacity-70" : "hover:border-orange-500/40"
      }`}
      style={{
        background: habit.completed_today ? "var(--dark-700, #1a1a26)" : "var(--surface)",
        borderColor: habit.completed_today ? habit.color + "66" : "var(--border)",
        borderLeftWidth: "3px",
        borderLeftColor: habit.color,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <h3 className={`font-display font-semibold text-base ${habit.completed_today ? "line-through opacity-50" : "text-white"}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-xs opacity-40 mt-0.5">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleCheckin}
            disabled={loading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
              habit.completed_today
                ? "text-white"
                : "border-2 hover:border-orange-500 hover:text-orange-500"
            }`}
            style={{
              background: habit.completed_today ? habit.color : "transparent",
              borderColor: habit.completed_today ? habit.color : "var(--border)",
            }}
          >
            {habit.completed_today ? <Check size={16} /> : <Check size={16} />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4">
        {habit.current_streak > 0 && (
          <div className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: "#f97316" }}>
            <Flame size={13} className="animate-streak-fire" />
            <span>{habit.current_streak} días</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs opacity-40">
          <span>{habit.total_completions} total</span>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-0.5 rounded-full opacity-50"
            style={{ background: "var(--border)" }}>
            {habit.category}
          </span>
        </div>
      </div>
    </div>
  );
}
