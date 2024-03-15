from typing import Dict, List
from ..models.post import Comment_With_Child, Comment


def format_comments(comments: List[Comment]) -> List[Comment_With_Child]:
    parent_comments = {}
    for key, comment in comments.items():
        parent_id = comment['parent_id']
        if parent_id is not None:
            if parent_id not in parent_comments:
                parent_comments[parent_id] = []
            parent_comments[parent_id].append(comment)

    # Add child comments to parent comments
    for key, comment in comments.items():
        parent_id = comment['id']
        if parent_id in parent_comments:
            comment['child'] = parent_comments[parent_id]

    # Filter out comments without a parent_id
    structured_comments = [
        comment for comment in comments.values() if comment['parent_id'] is None]

    return structured_comments
