from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models.models import Habit, HabitLog, User, Achievement, UserAchievement


def calculate_streak(db: Session, habit_id: int) -> tuple[int, int]:
    """Returns (current_streak, longest_streak)"""
    logs = (
        db.query(HabitLog.date)
        .filter(HabitLog.habit_id == habit_id)
        .order_by(HabitLog.date.desc())
        .all()
    )
    if not logs:
        return 0, 0

    dates = sorted({l.date for l in logs}, reverse=True)
    today = str(date.today())
    yesterday = str(date.today() - timedelta(days=1))

    # Current streak
    current = 0
    if dates[0] in (today, yesterday):
        check = date.fromisoformat(dates[0])
        for d in dates:
            d_date = date.fromisoformat(d)
            if (check - d_date).days <= 1:
                current += 1
                check = d_date
            else:
                break

    # Longest streak
    longest = 1
    temp = 1
    for i in range(1, len(dates)):
        prev = date.fromisoformat(dates[i - 1])
        curr = date.fromisoformat(dates[i])
        if (prev - curr).days == 1:
            temp += 1
            longest = max(longest, temp)
        else:
            temp = 1

    return current, max(longest, current)


def xp_for_completion(streak: int) -> int:
    """XP earned per completion, with streak multiplier"""
    base = 10
    if streak >= 30:
        return base * 3
    elif streak >= 7:
        return base * 2
    elif streak >= 3:
        return int(base * 1.5)
    return base


def level_from_xp(xp: int) -> tuple[int, int]:
    """Returns (level, xp_needed_for_next_level)"""
    thresholds = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 10000]
    for i, threshold in enumerate(thresholds):
        if xp < threshold:
            return i, threshold - xp
    return len(thresholds), 0


ACHIEVEMENTS = [
    {"key": "first_checkin", "name": "Primer paso", "description": "Completá tu primer hábito", "icon": "🌱", "xp_reward": 50},
    {"key": "streak_3", "name": "En racha", "description": "3 días seguidos en un hábito", "icon": "🔥", "xp_reward": 75},
    {"key": "streak_7", "name": "Una semana", "description": "7 días seguidos en un hábito", "icon": "⚡", "xp_reward": 150},
    {"key": "streak_30", "name": "Un mes imparable", "description": "30 días seguidos en un hábito", "icon": "💎", "xp_reward": 500},
    {"key": "habits_3", "name": "Multi-hábito", "description": "Creá 3 hábitos distintos", "icon": "🎯", "xp_reward": 100},
    {"key": "checkins_10", "name": "Consistente", "description": "10 check-ins en total", "icon": "✅", "xp_reward": 100},
    {"key": "checkins_50", "name": "Dedicado", "description": "50 check-ins en total", "icon": "🏅", "xp_reward": 200},
    {"key": "checkins_100", "name": "Centurión", "description": "100 check-ins en total", "icon": "🏆", "xp_reward": 500},
    {"key": "perfect_week", "name": "Semana perfecta", "description": "Completá todos tus hábitos 7 días seguidos", "icon": "🌟", "xp_reward": 300},
]


def seed_achievements(db: Session):
    for a in ACHIEVEMENTS:
        existing = db.query(Achievement).filter(Achievement.key == a["key"]).first()
        if not existing:
            db.add(Achievement(**a))
    db.commit()


def check_and_unlock_achievements(db: Session, user: User, habit: Habit, streak: int):
    """Check if any achievements should be unlocked and award XP"""
    total_logs = db.query(func.count(HabitLog.id)).join(Habit).filter(Habit.user_id == user.id).scalar()
    total_habits = db.query(func.count(Habit.id)).filter(Habit.user_id == user.id).scalar()

    def unlock(key: str):
        achievement = db.query(Achievement).filter(Achievement.key == key).first()
        if not achievement:
            return
        already = db.query(UserAchievement).filter_by(user_id=user.id, achievement_id=achievement.id).first()
        if not already:
            db.add(UserAchievement(user_id=user.id, achievement_id=achievement.id))
            user.xp += achievement.xp_reward
            db.commit()

    if total_logs >= 1:
        unlock("first_checkin")
    if total_logs >= 10:
        unlock("checkins_10")
    if total_logs >= 50:
        unlock("checkins_50")
    if total_logs >= 100:
        unlock("checkins_100")
    if total_habits >= 3:
        unlock("habits_3")
    if streak >= 3:
        unlock("streak_3")
    if streak >= 7:
        unlock("streak_7")
    if streak >= 30:
        unlock("streak_30")

    # Update level
    user.level, _ = level_from_xp(user.xp)
    db.commit()
