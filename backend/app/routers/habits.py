from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.database import get_db
from app.models.models import User, Habit, HabitLog
from app.schemas.schemas import HabitCreate, HabitUpdate, HabitOut, HabitLogOut, HabitLogCreate
from app.services.auth import get_current_user
from app.services.gamification import calculate_streak, xp_for_completion, check_and_unlock_achievements, level_from_xp

router = APIRouter(prefix="/habits", tags=["habits"])


def enrich_habit(habit: Habit, db: Session) -> HabitOut:
    today = str(date.today())
    current_streak, longest_streak = calculate_streak(db, habit.id)
    total = db.query(HabitLog).filter(HabitLog.habit_id == habit.id).count()
    completed_today = db.query(HabitLog).filter(
        HabitLog.habit_id == habit.id,
        HabitLog.date == today
    ).first() is not None

    return HabitOut(
        **{c.name: getattr(habit, c.name) for c in habit.__table__.columns},
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_completions=total,
        completed_today=completed_today,
    )


@router.get("/", response_model=List[HabitOut])
def list_habits(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.is_active == True).all()
    return [enrich_habit(h, db) for h in habits]


@router.post("/", response_model=HabitOut, status_code=status.HTTP_201_CREATED)
def create_habit(data: HabitCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = Habit(**data.model_dump(), user_id=current_user.id)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, db)


@router.patch("/{habit_id}", response_model=HabitOut)
def update_habit(habit_id: int, data: HabitUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, db)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(habit_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado")
    habit.is_active = False
    db.commit()


@router.post("/{habit_id}/checkin", response_model=HabitLogOut, status_code=status.HTTP_201_CREATED)
def checkin(habit_id: int, data: HabitLogCreate = HabitLogCreate(), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado")

    today = str(date.today())
    existing = db.query(HabitLog).filter(HabitLog.habit_id == habit_id, HabitLog.date == today).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya completaste este hábito hoy")

    log = HabitLog(habit_id=habit_id, date=today, note=data.note)
    db.add(log)
    db.commit()
    db.refresh(log)

    # Award XP
    current_streak, _ = calculate_streak(db, habit_id)
    xp_earned = xp_for_completion(current_streak)
    current_user.xp += xp_earned
    current_user.level, _ = level_from_xp(current_user.xp)
    db.commit()

    # Check achievements
    check_and_unlock_achievements(db, current_user, habit, current_streak)

    return log


@router.delete("/{habit_id}/checkin", status_code=status.HTTP_204_NO_CONTENT)
def undo_checkin(habit_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = str(date.today())
    log = db.query(HabitLog).filter(HabitLog.habit_id == habit_id, HabitLog.date == today).first()
    if not log:
        raise HTTPException(status_code=404, detail="No hay check-in hoy para deshacer")
    db.delete(log)
    db.commit()
