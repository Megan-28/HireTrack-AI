
from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    company: str = Field(min_length=1)
    job_title: str = Field(min_length=1)
    job_link: Optional[str] = None

    status: Literal[
        "Applied",
        "Interview",
        "Selected",
        "Rejected"
    ] = "Applied"

    date_applied: date = Field(default_factory=date.today)
class JobStatusUpdate(BaseModel):
    status: Literal[
        "Applied",
        "Interview",
        "Selected",
        "Rejected"
    ]