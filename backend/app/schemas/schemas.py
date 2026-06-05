from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    xp: int
    level: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Habits ────────────────────────────────────────────
class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: str = "⭐"
    color: str = "#6366f1"
    category: str = "general"
    frequency: str = "daily"
    target_days: str = "1234567"


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None


class HabitOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon: str
    color: str
    category: str
    frequency: str
    target_days: str
    is_active: bool
    created_at: datetime
    current_streak: int = 0
    longest_streak: int = 0
    total_completions: int = 0
    completed_today: bool = False

    class Config:
        from_attributes = True


# ── Logs ──────────────────────────────────────────────
class HabitLogCreate(BaseModel):
    note: Optional[str] = None


class HabitLogOut(BaseModel):
    id: int
    habit_id: int
    date: str
    note: Optional[str]
    completed_at: datetime

    class Config:
        from_attributes = True


# ── Achievements ──────────────────────────────────────
class AchievementOut(BaseModel):
    id: int
    key: str
    name: str
    description: str
    icon: str
    xp_reward: int
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Stats ─────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_habits: int
    completed_today: int
    pending_today: int
    total_xp: int
    level: int
    xp_to_next_level: int
    weekly_completion_rate: float
    longest_streak_overall: int
