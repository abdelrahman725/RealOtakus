import random

from django.core.management.base import BaseCommand

from otakus.models import User
from otakus.models import Anime

from otakus.constants import COUNTRIES, LEVELS, BEGINNER


class Command(BaseCommand):
    help = "generate random  Users for testing purposes"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=10,
        )

        parser.add_argument(
            "--level",
            type=bool,
            default=False,
        )

    def handle(self, *args, **options):
        n_users = options["users"]
        random_level = options = ["level"]

        print(f"\n\n generating {n_users} users...\n")

        animes = Anime.objects.all()

        for i in range(n_users):
            level = random.choice(list(LEVELS)) if random_level else BEGINNER
            user = User.objects.create_user(
                username=f"user_{i+1}",
                email=f"user_{i+1}@example.com",
                password="password",
                country=random.choice(list(COUNTRIES)),
                level=level,
                points=LEVELS[level] + random.randint(0, LEVELS[level] + 100) if random_level else 0
            )

            # make first user reviewer of all animes
            if i == 0:
                user.animes_to_review.add(*animes)

        print("\n Done \n")
