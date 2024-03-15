from pydantic import BaseModel


class Post_Comment_Req(BaseModel):
    parent_id: int | None = None
    display_name: str | None = None
    text: str
