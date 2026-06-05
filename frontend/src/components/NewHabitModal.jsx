import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/client";
import toast from "react-hot-toast";

const ICONS = ["⭐", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "🎯", "🎸", "✍️", "🌿", "💊", "🧹", "💻"];
const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#ef4444"];
const CATEGORIES = ["salud", "estudio", "bienestar", "finanzas", "deporte", "general"];

export default function NewHabitModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", description: "", icon: "⭐", color: "#f97316", category: "general",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/habits/", form);
      toast.success("¡Hábito creado!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl border p-6 animate-pop"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">Nuevo hábito</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs opacity-60 uppercase tracking-wider font-semibold">Nombre</label>
            <input
              className="w-full mt-1 px-4 py-3 rounded-xl text-white border outline-none focus:border-orange-500 transition-colors"
              style={{ background: "#1a1a26", borderColor: "var(--border)" }}
              placeholder="Ej: Leer 20 minutos"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs opacity-60 uppercase tracking-wider font-semibold">Descripción (opcional)</label>
            <input
              className="w-full mt-1 px-4 py-3 rounded-xl text-white border outline-none focus:border-orange-500 transition-colors"
              style={{ background: "#1a1a26", borderColor: "var(--border)" }}
              placeholder="Detalles del hábito..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Icons */}
          <div>
            <label className="text-xs opacity-60 uppercase tracking-wider font-semibold">Ícono</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ICONS.map((ic) => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                  className="w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: form.icon === ic ? "var(--accent-dim)" : "#1a1a26",
                    border: `2px solid ${form.icon === ic ? "#f97316" : "transparent"}`,
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-xs opacity-60 uppercase tracking-wider font-semibold">Color</label>
            <div className="flex gap-2 mt-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className="w-8 h-8 rounded-lg transition-all"
                  style={{
                    background: c,
                    outline: form.color === c ? `3px solid ${c}` : "none",
                    outlineOffset: "2px",
                  }} />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs opacity-60 uppercase tracking-wider font-semibold">Categoría</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all capitalize"
                  style={{
                    background: form.category === cat ? "#f97316" : "#1a1a26",
                    color: form.category === cat ? "white" : "#888",
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-display font-bold text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
            {loading ? "Creando..." : "Crear hábito 🎯"}
          </button>
        </form>
      </div>
    </div>
  );
}
