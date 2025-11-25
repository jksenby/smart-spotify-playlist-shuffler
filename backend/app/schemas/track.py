from pydantic import BaseModel

class TrackBase(BaseModel):
    title: str
    artist: str

class TrackCreate(TrackBase):
    pass

class TrackOut(TrackBase):
    id: int
    position: int
    
    class Config:
        from_attributes = True