from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, habits, stats
from app.models import models
from app.services.auth import get_current_user
from app.schemas.schemas import UserOut
from app.models.models import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habit Tracker API",
    description="API para la app de hábitos con gamificación",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(stats.router)


@app.get("/auth/me", response_model=UserOut, tags=["auth"])
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@app.get("/health")
def health():
    return {"status": "ok"}