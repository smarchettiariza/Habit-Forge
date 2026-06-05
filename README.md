# 🔥 HabitForge

> Construí hábitos. Ganá XP. Subí de nivel.

HabitForge es una aplicación full stack para tracking de hábitos con gamificación. Cada hábito que completás te da XP, construye rachas y desbloquea logros.

![Stack](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)
![Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Stack](https://img.shields.io/badge/Docker-compose-2496ED?style=flat&logo=docker)

---
## 📸 Capturas

<img width="585" height="638" alt="image" src="https://github.com/user-attachments/assets/603c3c98-1419-451c-9001-18d49c571e9e" />

<img width="605" height="473" alt="image" src="https://github.com/user-attachments/assets/90a6fe29-3e8e-40b7-850c-ce74697a89ed" />

<img width="1913" height="674" alt="image" src="https://github.com/user-attachments/assets/51757025-a8e5-4dce-9035-14226c335a45" />

<img width="759" height="829" alt="image" src="https://github.com/user-attachments/assets/bd628497-3919-40c7-b328-0f925ed4e3f3" />


---

## ✨ Features

- ✅ **Check-in diario** — marcá tus hábitos cada día con un click
- 🔥 **Rachas (Streaks)** — días consecutivos completando un hábito
- ⚡ **Sistema de XP** — ganás más XP cuanto más larga la racha (1x → 1.5x → 2x → 3x)
- 📈 **Niveles** — subís de Principiante a Leyenda acumulando XP
- 🏆 **Logros** — se desbloquean automáticamente al alcanzar metas
- 🎨 **Personalización** — cada hábito tiene ícono, color y categoría propia
- 🔐 **Autenticación** — registro y login con JWT

---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Backend | FastAPI + SQLAlchemy |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT + bcrypt |
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS v3 |
| Contenedores | Docker + docker-compose |

---

## 🚀 Cómo correrlo localmente

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js](https://nodejs.org/) 18+

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/habit-tracker.git
cd habit-tracker
```

### 2. Levantar el backend

```bash
docker compose up --build
```

El backend estará disponible en `http://localhost:8000`
La documentación de la API en `http://localhost:8000/docs`

### 3. Instalar y correr el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
habit-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py           # Entry point FastAPI
│   │   ├── config.py         # Variables de entorno
│   │   ├── database.py       # Conexión SQLAlchemy
│   │   ├── models/           # Modelos de base de datos
│   │   ├── schemas/          # Schemas Pydantic
│   │   ├── routers/          # Endpoints (auth, habits, stats)
│   │   └── services/         # Lógica de negocio y gamificación
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/              # Cliente Axios
│   │   ├── components/       # HabitCard, XPBar, Modales
│   │   ├── context/          # AuthContext
│   │   └── pages/            # Dashboard, AuthPage
│   └── package.json
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Login → JWT |
| GET | `/auth/me` | Usuario actual |
| GET | `/habits/` | Listar hábitos |
| POST | `/habits/` | Crear hábito |
| PATCH | `/habits/{id}` | Editar hábito |
| DELETE | `/habits/{id}` | Archivar hábito |
| POST | `/habits/{id}/checkin` | Marcar completado + XP |
| DELETE | `/habits/{id}/checkin` | Deshacer check-in |
| GET | `/stats/dashboard` | Métricas generales |
| GET | `/stats/achievements` | Todos los logros |

---

## 🏆 Sistema de logros

| Logro | Condición | XP |
|---|---|---|
| 🌱 Primer paso | Primer check-in | 50 XP |
| 🔥 En racha | 3 días seguidos | 75 XP |
| ⚡ Una semana | 7 días seguidos | 150 XP |
| 💎 Un mes imparable | 30 días seguidos | 500 XP |
| 🎯 Multi-hábito | Crear 3 hábitos | 100 XP |
| ✅ Consistente | 10 check-ins totales | 100 XP |
| 🏅 Dedicado | 50 check-ins totales | 200 XP |
| 🏆 Centurión | 100 check-ins totales | 500 XP |

---

## 📄 Licencia

MIT
