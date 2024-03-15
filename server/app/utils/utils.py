from ..models.post import DB_Post


def get_post_by_url(posts_data: DB_Post, post_url: str):
    post = next((p for p in posts_data if p["post_url"] == post_url), None)
    return post
