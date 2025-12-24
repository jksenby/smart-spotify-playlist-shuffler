import random
from typing import Dict

def basic_shuffle(tracks: Dict[str, any]):
    """Basic shuffle algorithm"""
    random.shuffle(tracks)
    return tracks