import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, get_db
import app.models  # Ensure all models are registered
from app.services.seed import seed_database
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.opportunities import router as opp_router
from app.api.recommendations import router as rec_router
from app.api.saved import router as saved_router
from app.api.applications import router as app_router
from app.api.admin import router as admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure tables are created immediately
Base.metadata.create_all(bind=engine)
try:
    _db = next(get_db())
    seed_database(_db)
    _db.close()
except Exception as ex:
    logger.warning(f"Initial seed notice: {ex}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up...")
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_database(db)
        logger.info("Database verified and seeded successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("Application shutting down...")

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI Opportunity Matcher API using TF-IDF, Cosine Similarity, and Multi-Criteria Weighted Scoring.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(opp_router, prefix=settings.API_V1_STR)
app.include_router(rec_router, prefix=settings.API_V1_STR)
app.include_router(saved_router, prefix=settings.API_V1_STR)
app.include_router(app_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API. Explore endpoints at /docs."
    }
