from __future__ import annotations

import asyncio
from dataclasses import dataclass
from enum import StrEnum
from typing import Final

DEFAULT_PROFILE: Final[str] = "shokunin"
MIN_CONTRAST: Final[float] = 4.8

class TokenRole(StrEnum):
    CALLABLE = "callable"
    STRUCTURE = "structure"
    VALUE = "value"

@dataclass(slots=True)
class ThemeProfile:
    name: str
    accent: str
    type_hint: str
    weights: dict[TokenRole, float]

    @property
    def is_accessible(self) -> bool:
        return sum(self.weights.values()) >= MIN_CONTRAST

class ThemeEngine:
    async def render(self, source: str) -> ThemeProfile:
        await asyncio.sleep(0)
        if "kanagawa" in source:
            raise ValueError("use Sumi classes and Ume type hints")
        weights = dict.fromkeys(TokenRole, 1.6)
        return ThemeProfile(DEFAULT_PROFILE, "#006FAE", "#8F4155", weights)
