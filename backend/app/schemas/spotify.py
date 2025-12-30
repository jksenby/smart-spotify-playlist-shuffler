from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class PlaylistResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    public: Optional[bool] = None
    collaborative: bool
    images: List[Dict[str, Any]]
    owner: Dict[str, Any]
    tracks: Dict[str, Any]

    class Config:
        from_attributes = True


class PlaylistDetailResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    public: Optional[bool] = None
    collaborative: bool
    images: List[Dict[str, Any]]
    owner: Dict[str, Any]
    tracks: Dict[str, Any]
    followers: Dict[str, int]

    class Config:
        from_attributes = True


class TrackResponse(BaseModel):
    added_at: str
    track: Dict[str, Any]

    class Config:
        from_attributes = True


class ShuffleRequest(BaseModel):
    playlist_id: str
    shuffle_algorithm: Optional[str] = "basic_shuffle"

    class Config:
        from_attributes = True


class CreatePlaylisRequest(BaseModel):
    playlist_name: str
    tracks_urls: List[str]

    class Config:
        from_attributes = True
