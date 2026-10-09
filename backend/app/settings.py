from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config.yaml"


class ServerConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 8787
    reload: bool = True


class DefaultsConfig(BaseModel):
    delay_ms: int = 0


class AppConfig(BaseModel):
    server: ServerConfig = Field(default_factory=ServerConfig)
    scenarios: dict[str, bool] = Field(default_factory=dict)
    defaults: DefaultsConfig = Field(default_factory=DefaultsConfig)


class EnvSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APIXA_BACKEND_", extra="ignore")

    host: str | None = None
    port: int | None = None
    delay_ms: int | None = None


def load_config() -> AppConfig:
    raw: dict[str, Any] = {}
    if CONFIG_PATH.exists():
        raw = yaml.safe_load(CONFIG_PATH.read_text()) or {}
    config = AppConfig.model_validate(raw)
    env = EnvSettings()
    if env.host is not None:
        config.server.host = env.host
    if env.port is not None:
        config.server.port = env.port
    if env.delay_ms is not None:
        config.defaults.delay_ms = env.delay_ms
    return config
