import random

from django.core.management.base import BaseCommand

from otakus.models import User
from otakus.models import Anime

from otakus.constants import COUNTRIES

class Command(BaseCommand):

    help = "generate random  Users for testing purposes"
   
    def add_arguments(self, parser):

        parser.add_argument(
            "--users",
            type=int,
            default=10,
        )

    def handle(self, *args, **options):

        n_users = options["users"]
        
        print(f"\n\n generating {n_users} users...\n")

        animes = Anime.objects.all()

        for i in range(n_users):

            user = User.objects.create_user( 
                username=f"user_{i+1}",
                email=f"user_{i+1}@example.com",
                password="password",
                country=random.choice(list(COUNTRIES))
            )
            
            # make first user reviewer of all animes
            if i==0:
                user.animes_to_review.add(*animes)

        print("\n Done \n")
