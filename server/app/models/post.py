from datetime import datetime
from typing import Dict, List
from pydantic import BaseModel


class Post(BaseModel):
    post_url: str
    title: str
    created_at: str
    num_hugs: int
    patient_description: str
    num_comments: int


class Expanded_Post(Post):
    post_url: str
    title: str
    created_at: str
    num_hugs: int
    patient_description: str
    num_comments: int
    assessment: str
    question: str | None = None


class Comment(BaseModel):
    id: int
    parent_id: int | None = None
    display_name: str
    text: str
    created_at: datetime


class Partial_Comment(BaseModel):
    question: str | None = None
    assessment: str | None = None


class Comment_With_Child(Comment):
    id: int
    parent_id: int | None = None
    display_name: str
    text: str
    created_at: datetime
    child: List["Comment_With_Child"] | None = None


class DB_Post(BaseModel):
    post_url: str
    title: str
    created_at: datetime
    num_hugs: int
    patient_description: str | None = None
    assessment: str
    question: str
    comments: Dict[str, Comment]
