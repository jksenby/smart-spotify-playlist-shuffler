import base64
import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import JWTError, jwt
from urllib.parse import quote

from app.db.session import get_db
from app.security import create_access_token, generate_random_string
from app.config import settings
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
)

async def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = None

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")

    if not token:
        token = request.cookies.get("access_token")
        
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
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
    from urllib.parse import urlencode
    
    params = {
        "response_type": "code",
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "scope": "user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private user-read-playback-position user-read-recently-played",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "state": generate_random_string(16)
    }
    
    url = f"https://accounts.spotify.com/authorize?{urlencode(params)}"
    return RedirectResponse(url)

@router.get("/callback")
async def callback_spotify(code: str, db: Session = Depends(get_db)):
    """
    Exchanges the auth code for a token, fetches the user from Spotify,
    updates the DB, and sets the HTTPOnly Session Cookie.
    """
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
    email = user_data.get("email")
    country = user_data.get("country")
    product = user_data.get("product")
    images = user_data.get("images")
    followers = user_data.get("followers")
    external_urls = user_data.get("external_urls")
    
    stmt = select(User).where(User.spotify_id == spotify_id)
    user = db.execute(stmt).scalars().first()
    
    if not user:
        user = User(
            spotify_id=spotify_id, 
            display_name=display_name,
            email=email,
            country=country,
            product=product,
            images=images,
            followers=followers,
            external_urls=external_urls
        )
        db.add(user)
    else:
        user.display_name = display_name
        user.email = email
        user.country = country
        user.product = product
        user.images = images
        user.followers = followers
        user.external_urls = external_urls
        
    db.commit()
    
    access_token = create_access_token(data={"sub": spotify_id})
    
    redirect_url = f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
    return RedirectResponse(url=redirect_url, status_code=status.HTTP_303_SEE_OTHER)

@router.get("/me")
def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/logout")
def logout():
    """Clears the authentication cookie"""
    response = Response(status_code=status.HTTP_200_OK)
    response.delete_cookie(
        key="access_token", 
        httponly=True, 
        secure=True, 
        samesite="lax", 
        path="/"
    )
    return {"message": "Logged out successfully"}