from datetime import datetime
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

# Import models
from .models.post import Comment_With_Child, Expanded_Post, Partial_Comment
from .models.response import CommentResponse, PostsResponse, ExpandedPostResponse, PartialCommentResponse
from .models.request import Post_Comment_Req
from .utils.utils import get_post_by_url
from .formatter.formatter import format_comments


from .database.data_loader import load_data_from_json

# Initialize FastAPI
app = FastAPI()

# Initialize FastAPI
app = FastAPI()

origins = [
    # React's default port
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

posts_data = load_data_from_json()


# Endpoint for paginated posts retrieval for infinite scrolling.
# Utilizes a simple offset-based approach; in a production environment with a database,
# cursor-based pagination would be implemented for improved performance and scalability.
# This endpoint sends only the necessary data to display on the infinite scroll.
@app.get('/v1/posts', tags=["posts"], summary="Get a Subset of Posts",  response_model=PostsResponse)
async def get_posts(limit: int = 1, offset: int = 0) -> PostsResponse:
    if limit <= 0:
        raise HTTPException(
            status_code=400, detail="Limit must be greater than zero")

    if offset < 0:
        raise HTTPException(
            status_code=400, detail="Offset must be greater than or equal to zero")

    start_idx = max(0, offset)
    end_idx = min(len(posts_data), start_idx + limit)

    subset_posts = []
    for post in posts_data[start_idx:end_idx]:
        subset_post = {
            "post_url": post["post_url"],
            "title": post["title"],
            "created_at": post["created_at"],
            "num_hugs": post["num_hugs"],
            "patient_description": post["patient_description"],
            "num_comments": len(post["comments"]),
        }

        subset_posts.append(subset_post)

    has_more = end_idx < len(posts_data)

    return PostsResponse(posts=subset_posts, hasMore=has_more)


# Endpoint to fetch an individual post by its post_url.
# This endpoint provides all the necessary data for displaying an expanded post.
# It is typically triggered when a user visits the post directly via a link.
# Otherwise, data may be retrieved from the frontend React context.
@app.get('/v1/posts/{post_url}', tags=["posts"], summary="Get an individual post by post_url", response_model=ExpandedPostResponse)
async def get_expanded_post(post_url: str) -> Expanded_Post:
    post = get_post_by_url(posts_data, post_url)
    if post:
        expanded_post = Expanded_Post(
            title=post["title"],
            patient_description=post["patient_description"],
            assessment=post["assessment"],
            num_hugs=post["num_hugs"],
            num_comments=len(post["comments"]),
            post_url=post["post_url"],
            created_at=post["created_at"],
        )
        return ExpandedPostResponse(post=expanded_post)
    else:
        raise HTTPException(status_code=404, detail="Post not found")


# Endpoint to retrieve partial attributes of a post.
# When a user clicks on a post from the infinite scroll, additional data is fetched and stored in the React context.
# This data is then combined with the information from the '/v1/posts' endpoint to create a full expanded post data.
@app.get('/v1/posts/{post_url}/partial', tags=["posts"], summary="Get partial attributes of a post", response_model=PartialCommentResponse)
async def get_partial_post_attributes(post_url: str) -> Partial_Comment:
    post = get_post_by_url(posts_data, post_url)
    if post:
        partial_attributes = {
            "assessment": post.get("assessment"),
            "question": post.get("question", None),
            # Add more attributes here as needed
        }
        return PartialCommentResponse(post=partial_attributes)
    else:
        raise HTTPException(status_code=404, detail="Post not found")


# Endpoint to increment the number of hugs for a post by 1.
# For improved user experience, the frontend does not require a response back while waiting for the hug to update.
@app.patch('/v1/posts/{post_url}/hugs', tags=["posts"], summary="Increment num_hugs for a post by 1")
async def hug_post(post_url: str) -> None:
    post = get_post_by_url(posts_data, post_url)
    if post["post_url"] == post_url:
        post["num_hugs"] += 1
        return Response(status_code=204)
    raise HTTPException(status_code=404, detail="Post not found")


# Endpoint to retrieve comments for a post.
# Returns comments in a nested hierarchy format, including parent and child relationships.
@app.get('/v1/posts/{post_url}/comments', tags=["posts"], summary="Get comments for a post", response_model=CommentResponse)
async def get_comments(post_url: str) -> Comment_With_Child:
    post = get_post_by_url(posts_data, post_url)
    if post:
        structured_comments = format_comments(post["comments"])
        return CommentResponse(comments=structured_comments)
    else:
        raise HTTPException(status_code=404, detail="Post not found")


# Endpoint to create a comment on a post.
# Simulates creating a comment to mock database functionality.
@app.put('/v1/posts/{post_url}/comments', tags=["posts"], summary="Post a comment on a post", response_model=CommentResponse)
async def post_comment(post_url: str, req: Post_Comment_Req) -> Comment_With_Child:
    post_index = next((idx for idx, p in enumerate(
        posts_data) if p["post_url"] == post_url), None)
    if post_index is not None:
        post = posts_data[post_index]
        comments = post["comments"]
        # Generate Id for the new comment (should be automatically incremented by DB)
        new_comment_id = len(comments) + 1
        new_comment = {
            "id": new_comment_id,
            "parent_id": req.parent_id,
            "display_name": req.display_name,
            "text": req.text,
            "created_at": datetime.now().isoformat()  # Generate current timestamp
        }
        posts_data[post_index]["comments"][new_comment_id] = new_comment
        structured_comments = format_comments(post["comments"])
        return CommentResponse(comments=structured_comments)
    else:
        raise HTTPException(status_code=404, detail="Post not found")
