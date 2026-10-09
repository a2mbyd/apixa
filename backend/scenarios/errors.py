from __future__ import annotations

from fastapi import APIRouter, HTTPException

PREFIX = ""
TAGS = ["errors"]
router = APIRouter()


@router.get("/errors/not-found")
def not_found():
    raise HTTPException(status_code=404, detail="Intentional 404")


@router.get("/errors/server")
def server_error():
    raise HTTPException(status_code=500, detail="Intentional 500")


@router.get("/errors/unauthorized")
def unauthorized():
    raise HTTPException(status_code=401, detail="Intentional 401")
