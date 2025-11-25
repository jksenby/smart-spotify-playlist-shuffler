from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.user import User
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.user import User

class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(index=True)
    artist: Mapped[str] = mapped_column(index=True)
    position: Mapped[int] = mapped_column(index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship("app.models.user.User", back_populates="tracks")