import base64
import httpx
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import JWTError, jwt

from app.db.session import get_db
from app.security import create_access_token, generate_random_string
from app.config import settings
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise credentials_exception from exc

    spotify_id: str | None = payload.get("sub")
    if spotify_id is None:
        raise credentials_exception
        
    stmt = select(User).where(User.spotify_id == spotify_id)
    user = db.execute(stmt).scalars().first()
    
    if user is None:
        raise credentials_exception
    return user


@router.get("/login")
def login_spotify():
    """Redirects User to Spotify Authorization Page"""
    scopes = "user-read-private user-read-email"
    state = generate_random_string(16)
    url = (
        f"https://accounts.spotify.com/authorize"
        f"?response_type=code"
        f"&client_id={settings.SPOTIFY_CLIENT_ID}"
        f"&scope={scopes}"
        f"&redirect_uri={settings.SPOTIFY_REDIRECT_URI}"
        f"&state={state}"
    )
    return RedirectResponse(url)

@router.get("/callback")
async def callback_spotify(code: str, db: Session = Depends(get_db)):
    auth_string = f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("ascii")
    auth_base64 = base64.b64encode(auth_bytes).decode("ascii")

    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
    }

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://accounts.spotify.com/api/token",
            data=data,
            headers=headers,
        )
        
        if token_res.status_code != 200:
             print(f"Spotify Error: {token_res.text}")
             raise HTTPException(status_code=400, detail="Failed to retrieve Spotify token")
             
        token_data = token_res.json()
        spotify_access_token = token_data.get("access_token")

        user_res = await client.get(
            "https://api.spotify.com/v1/me",
            headers={"Authorization": f"Bearer {spotify_access_token}"}
        )
        user_data = user_res.json()
        
    spotify_id = user_data.get("id")
    display_name = user_data.get("display_name")
    
    stmt = select(User).where(User.spotify_id == spotify_id)
    user = db.execute(stmt).scalars().first()
    
    if not user:
        user = User(spotify_id=spotify_id, display_name=display_name)
        db.add(user)
        db.commit()
    
    access_token = create_access_token(data={"sub": spotify_id})
    
    redirect_url = f"{settings.FRONTEND_URL}?token={access_token}"
    return RedirectResponse(redirect_url)