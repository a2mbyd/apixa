from __future__ import annotations

import importlib
import pkgutil
from types import ModuleType

from fastapi import APIRouter, FastAPI

from app.settings import AppConfig


def _iter_scenario_modules() -> list[ModuleType]:
    import scenarios

    modules: list[ModuleType] = []
    for info in pkgutil.iter_modules(scenarios.__path__, scenarios.__name__ + "."):
        modules.append(importlib.import_module(info.name))
    return modules


def mount_scenarios(app: FastAPI, config: AppConfig) -> list[str]:
    mounted: list[str] = []
    for module in _iter_scenario_modules():
        name = module.__name__.rsplit(".", 1)[-1]
        if not config.scenarios.get(name, False):
            continue
        router = getattr(module, "router", None)
        if not isinstance(router, APIRouter):
            raise RuntimeError(f"scenarios.{name} must export an APIRouter named router")
        prefix = getattr(module, "PREFIX", "")
        tags = getattr(module, "TAGS", [name])
        app.include_router(router, prefix=prefix, tags=list(tags))
        mounted.append(name)
    return mounted
