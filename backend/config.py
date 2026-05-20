import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-me'
    # Check for Vercel Postgres URL first, then fallback to standard DATABASE_URL
    # If on Vercel and no DB is provided, use /tmp/boutique.db to prevent read-only crash
    fallback_db = 'sqlite:////tmp/boutique.db' if os.environ.get('VERCEL') else 'sqlite:///boutique.db'
    db_url = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL') or fallback_db
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-super-secret-key-change-me'
    JWT_ACCESS_TOKEN_EXPIRES = False
    # Use /tmp for serverless environments (Vercel) since other folders are read-only
    UPLOAD_FOLDER = '/tmp/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload size
