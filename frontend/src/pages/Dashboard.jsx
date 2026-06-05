import { useState, useEffect, useCallback } from "react";
import { Plus, LogOut, Trophy, Flame, Target, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import HabitCard from "../components/HabitCard";
import NewHabitModal from "../components/NewHabitModal";
import XPBar from "../components/XPBar";
import TutorialModal from "../components/TutorialModal";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("hoy");
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const tutorialVisto = localStorage.getItem("tutorial_seen");
    if (!tutorialVisto) {
      setTimeout(() => setShowTutorial(true), 500);
    }
  }, []);



  const fetchAll = useCallback(async () => {
    try {
      const [habitsRes, statsRes, achRes] = await Promise.all([
        api.get("/habits/"),
        api.get("/stats/dashboard"),
        api.get("/stats/achievements"),
      ]);
      setHabits(habitsRes.data);
      setStats(statsRes.data);
      setAchievements(achRes.data);
    } catch {
      toast.error("Error cargando datos");
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pendingHabits = habits.filter((h) => !h.completed_today);
  const completedHabits = habits.filter((h) => h.completed_today);
  const unlockedAchievements = achievements.filter((a) => a.unlocked_at);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h1 className="text-xl font-display font-bold text-white">HabitForge</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-50 hidden sm:block">
            Hola, {user?.username}
          </span>

          <button
            onClick={() => setShowTutorial(true)}
            className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors opacity-50 hover:opacity-100 text-sm"
          >
            ❓ Ayuda
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors opacity-50 hover:opacity-100"
          >
            <LogOut size={16} />
          </button>
          {showTutorial && (

            <TutorialModal
              onClose={() => {
                localStorage.setItem("tutorial_seen", "true");
                setShowTutorial(false);
              }}
            />
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* XP Bar */}
        {stats && (
          <XPBar xp={stats.total_xp} level={stats.level} xpToNext={stats.xp_to_next_level} />
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Target size={16} />, label: "Hábitos", value: stats.total_habits },
              { icon: <CheckCircle size={16} />, label: "Hoy", value: `${stats.completed_today}/${stats.total_habits}` },
              { icon: <Flame size={16} />, label: "Mayor racha", value: stats.longest_streak_overall },
              { icon: <Trophy size={16} />, label: "Logros", value: `${unlockedAchievements.length}/${achievements.length}` },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3 border text-center"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex justify-center mb-1" style={{ color: "#f97316" }}>{s.icon}</div>
                <div className="text-lg font-display font-bold text-white">{s.value}</div>
                <div className="text-xs opacity-40">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          {[
            { id: "hoy", label: "Hoy" },
            { id: "logros", label: `Logros ${unlockedAchievements.length > 0 ? `(${unlockedAchievements.length})` : ""}` },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t.id ? "#f97316" : "transparent",
                color: tab === t.id ? "white" : "#888",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Habits tab */}
        {tab === "hoy" && (
          <div className="space-y-4">
            {/* Add button */}
            <button onClick={() => setShowModal(true)}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:border-orange-500 hover:text-orange-500 opacity-50 hover:opacity-100"
              style={{ borderColor: "var(--border)" }}>
              <Plus size={16} /> Agregar hábito
            </button>

            {habits.length === 0 && (
              <div className="text-center py-12 opacity-30">
                <div className="text-4xl mb-3">🌱</div>
                <p className="font-display">Todavía no tenés hábitos</p>
                <p className="text-sm mt-1">Creá tu primer hábito arriba</p>
              </div>
            )}

            {pendingHabits.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Pendientes</p>
                {pendingHabits.map((h) => (
                  <div key={h.id} className="animate-fade-up">
                    <HabitCard habit={h} onUpdate={fetchAll} />
                  </div>
                ))}
              </div>
            )}

            {completedHabits.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Completados ✓</p>
                {completedHabits.map((h) => (
                  <HabitCard key={h.id} habit={h} onUpdate={fetchAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements tab */}
        {tab === "logros" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div key={a.id}
                className="rounded-2xl border p-4 flex items-center gap-3 transition-all"
                style={{
                  background: a.unlocked_at ? "var(--surface)" : "var(--dark-800, #111118)",
                  borderColor: a.unlocked_at ? "#f97316" : "var(--border)",
                  opacity: a.unlocked_at ? 1 : 0.4,
                }}>
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-white truncate">{a.name}</p>
                  <p className="text-xs opacity-50 mt-0.5">{a.description}</p>
                  <p className="text-xs mt-1" style={{ color: "#f97316" }}>+{a.xp_reward} XP</p>
                </div>
                {a.unlocked_at && <span className="text-lg">✅</span>}
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <NewHabitModal
          onClose={() => setShowModal(false)}
          onCreated={fetchAll}
        />
      )}

      {showTutorial && (
        <TutorialModal
          onClose={() => {
            localStorage.setItem("tutorial_seen", "true");
            setShowTutorial(false);
          }}
        />
      )}
    </div>
  );
}
