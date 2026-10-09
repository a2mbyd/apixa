from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

PREFIX = ""
TAGS = ["posts"]
router = APIRouter()


class PostCreate(BaseModel):
    title: str = Field(min_length=1)
    body: str = ""
    author_id: str = "1"


class Post(BaseModel):
    id: str
    title: str
    body: str
    author_id: str


_STORE: dict[str, Post] = {
    "1": Post(id="1", title="Hello Apixa", body="First post", author_id="1"),
}
_NEXT_ID = 2


@router.get("/posts", response_model=list[Post])
def list_posts() -> list[Post]:
    return list(_STORE.values())


@router.get("/posts/{post_id}", response_model=Post)
def get_post(post_id: str) -> Post:
    post = _STORE.get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/posts", response_model=Post, status_code=201)
def create_post(body: PostCreate) -> Post:
    global _NEXT_ID
    post = Post(
        id=str(_NEXT_ID),
        title=body.title,
        body=body.body,
        author_id=body.author_id,
    )
    _STORE[post.id] = post
    _NEXT_ID += 1
    return post


@router.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: str) -> None:
    if post_id not in _STORE:
        raise HTTPException(status_code=404, detail="Post not found")
    del _STORE[post_id]
