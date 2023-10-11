from django.core.cache import cache
from core.models import Anime

def query_or_get_cached_anime(anime_id: int) -> Anime:
    cached_animes = cache.get("animes")

    if cached_animes and anime_id in cached_animes:
        return cached_animes[anime_id]
    
    try:
        return Anime.objects.get(id=anime_id)

    except Anime.DoesNotExist:
        return None
