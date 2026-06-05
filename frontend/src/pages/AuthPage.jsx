import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await api.post(endpoint, payload);
      login(data.access_token, data.user);
      toast.success(`¡Bienvenido, ${data.user.username}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🔥</div>
          <h1 className="text-4xl font-display font-bold text-white">HabitForge</h1>
          <p className="text-sm mt-2 opacity-50">Construí hábitos. Ganá XP. Subí de nivel.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-8 border" style={{ borderColor: "var(--border)" }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 text-sm font-display font-semibold transition-all"
                style={{
                  background: mode === m ? "var(--accent)" : "transparent",
                  color: mode === m ? "white" : "#888"
                }}>
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          <form onSubmit={handle} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-semibold opacity-60 uppercase tracking-wider">Usuario</label>
                <input
                  className="w-full mt-1 px-4 py-3 rounded-xl text-white outline-none transition-all border focus:border-orange-500"
                  style={{ background: "var(--dark-700, #1a1a26)", borderColor: "var(--border)" }}
                  placeholder="tu_usuario"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold opacity-60 uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-3 rounded-xl text-white outline-none transition-all border focus:border-orange-500"
                style={{ background: "var(--dark-700, #1a1a26)", borderColor: "var(--border)" }}
                placeholder="vos@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold opacity-60 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-3 rounded-xl text-white outline-none transition-all border focus:border-orange-500"
                style={{ background: "var(--dark-700, #1a1a26)", borderColor: "var(--border)" }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-display font-bold text-white mt-2 transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              {loading ? "..." : mode === "login" ? "Entrar →" : "Crear cuenta →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
