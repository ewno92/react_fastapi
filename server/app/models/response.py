from pydantic import BaseModel
from typing import List
from .post import Comment_With_Child, Expanded_Post, Post, Partial_Comment


class CommentResponse(BaseModel):
    comments: List[Comment_With_Child]


class PostsResponse(BaseModel):
    posts: List[Post]
    hasMore: bool


class ExpandedPostResponse(BaseModel):
    post: Expanded_Post


class PartialCommentResponse(BaseModel):
    post: Partial_Comment
