from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date, timedelta
from app.database import get_db
from app.models.models import User, Habit, HabitLog, Achievement, UserAchievement
from app.schemas.schemas import DashboardStats, AchievementOut
from app.services.auth import get_current_user
from app.services.gamification import calculate_streak, level_from_xp

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = str(date.today())
    habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.is_active == True).all()

    total_habits = len(habits)
    completed_today = 0
    for h in habits:
        if db.query(HabitLog).filter(HabitLog.habit_id == h.id, HabitLog.date == today).first():
            completed_today += 1

    # Weekly completion rate
    week_start = str(date.today() - timedelta(days=6))
    total_possible = total_habits * 7
    week_logs = db.query(func.count(HabitLog.id)).join(Habit).filter(
        Habit.user_id == current_user.id,
        HabitLog.date >= week_start
    ).scalar()
    weekly_rate = (week_logs / total_possible * 100) if total_possible > 0 else 0

    # Longest streak overall
    longest = 0
    for h in habits:
        _, ls = calculate_streak(db, h.id)
        longest = max(longest, ls)

    _, xp_to_next = level_from_xp(current_user.xp)

    return DashboardStats(
        total_habits=total_habits,
        completed_today=completed_today,
        pending_today=total_habits - completed_today,
        total_xp=current_user.xp,
        level=current_user.level,
        xp_to_next_level=xp_to_next,
        weekly_completion_rate=round(weekly_rate, 1),
        longest_streak_overall=longest,
    )


@router.get("/achievements", response_model=List[AchievementOut])
def get_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    all_achievements = db.query(Achievement).all()
    unlocked = {ua.achievement_id: ua.unlocked_at for ua in db.query(UserAchievement).filter_by(user_id=current_user.id).all()}

    result = []
    for a in all_achievements:
        out = AchievementOut(
            id=a.id, key=a.key, name=a.name, description=a.description,
            icon=a.icon, xp_reward=a.xp_reward,
            unlocked_at=unlocked.get(a.id)
        )
        result.append(out)
    return result


@router.get("/heatmap/{habit_id}")
def heatmap(habit_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(HabitLog.date).filter(HabitLog.habit_id == habit_id).all()
    return {"dates": [l.date for l in logs]}
