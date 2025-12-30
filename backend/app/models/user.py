from typing import TYPE_CHECKING, List
from sqlalchemy import JSON, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.track import Track


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    spotify_id: Mapped[str] = mapped_column(unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(nullable=True)
    email: Mapped[str | None] = mapped_column(nullable=True)
    country: Mapped[str | None] = mapped_column(nullable=True)
    product: Mapped[str | None] = mapped_column(nullable=True)
    images: Mapped[list | None] = mapped_column(JSON, nullable=True)
    followers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    external_urls: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    current_playlist_id: Mapped[str | None] = mapped_column(String, nullable=True)

    spotify_access_token: Mapped[str | None] = mapped_column(String, nullable=True)
    spotify_refresh_token: Mapped[str | None] = mapped_column(String, nullable=True)
    spotify_token_expires_at: Mapped[int | None] = mapped_column(nullable=True)

    is_active: Mapped[bool] = mapped_column(default=True)

    tracks: Mapped[List["Track"]] = relationship("Track", back_populates="owner")
