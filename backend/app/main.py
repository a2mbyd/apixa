from __future__ import annotations

import asyncio

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.loader import mount_scenarios
from app.settings import load_config

config = load_config()

app = FastAPI(
    title="Apixa Test Backend",
    description="Configurable FastAPI backend for Apixa development and integration checks.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOUNTED = mount_scenarios(app, config)


@app.middleware("http")
async def optional_delay(request: Request, call_next):
    delay_ms = config.defaults.delay_ms
    if delay_ms > 0:
        await asyncio.sleep(delay_ms / 1000)
    return await call_next(request)


@app.get("/health")
async def health():
    return {
        "ok": True,
        "scenarios": MOUNTED,
        "delay_ms": config.defaults.delay_ms,
    }


@app.get("/")
async def root():
    return {
        "name": "apixa-test-backend",
        "docs": "/docs",
        "health": "/health",
        "hint": "Enable scenarios in config.yaml; add modules under scenarios/",
    }
