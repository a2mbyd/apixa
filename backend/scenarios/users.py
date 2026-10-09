from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

PREFIX = ""
TAGS = ["users"]
router = APIRouter()


class UserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None


class User(BaseModel):
    id: str
    name: str
    email: EmailStr


_STORE: dict[str, User] = {
    "1": User(id="1", name="Ada Lovelace", email="ada@example.com"),
    "2": User(id="2", name="Grace Hopper", email="grace@example.com"),
}
_NEXT_ID = 3


@router.get("/users", response_model=list[User])
def list_users() -> list[User]:
    return list(_STORE.values())


@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: str) -> User:
    user = _STORE.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users", response_model=User, status_code=201)
def create_user(body: UserCreate) -> User:
    global _NEXT_ID
    user = User(id=str(_NEXT_ID), name=body.name, email=body.email)
    _STORE[user.id] = user
    _NEXT_ID += 1
    return user


@router.put("/users/{user_id}", response_model=User)
def update_user(user_id: str, body: UserUpdate) -> User:
    user = _STORE.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    data: dict[str, Any] = user.model_dump()
    data.update(body.model_dump(exclude_unset=True))
    updated = User.model_validate(data)
    _STORE[user_id] = updated
    return updated


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str) -> None:
    if user_id not in _STORE:
        raise HTTPException(status_code=404, detail="User not found")
    del _STORE[user_id]
