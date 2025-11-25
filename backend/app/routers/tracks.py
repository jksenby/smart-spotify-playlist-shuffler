from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
import random

from app.db.session import get_db
from app.models.track import Track
from app.models.user import User
from app.schemas.track import TrackCreate, TrackOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/tracks", tags=["tracks"])

@router.get("/", response_model=List[TrackOut])
def get_tracks(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    stmt = select(Track)\
        .where(Track.owner_id == current_user.id)\
        .order_by(Track.position)
        
    result = db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=TrackOut)
def add_track(
    track_data: TrackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stmt = select(Track)\
        .where(Track.owner_id == current_user.id)\
        .order_by(Track.position.desc())\
        .limit(1)
        
    last_track = db.execute(stmt).scalars().first()
    new_position = (last_track.position + 1) if last_track else 0
    
    new_track = Track(
        title=track_data.title,
        artist=track_data.artist,
        position=new_position,
        owner_id=current_user.id
    )
    db.add(new_track)
    db.commit()
    db.refresh(new_track)
    return new_track

@router.post("/shuffle")
def shuffle_tracks(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    stmt = select(Track).where(Track.owner_id == current_user.id)
    tracks = db.execute(stmt).scalars().all()
    
    tracks_list = list(tracks)
    
    if not tracks_list:
        return {"message": "Empty playlist"}
    
    random.shuffle(tracks_list)
    
    for idx, track in enumerate(tracks_list):
        track.position = idx
    
    db.commit()
    return {"message": "Shuffled successfully"}