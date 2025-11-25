from typing import TYPE_CHECKING, List
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.track import Track

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    spotify_id: Mapped[str] = mapped_column(unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(nullable=True)

    tracks: Mapped[List["Track"]] = relationship("app.models.track.Track", back_populates="owner")
