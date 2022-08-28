import random

from django.core.management.base import BaseCommand

from ...models import *
from ...constants import COUNTRIES, LEVELS

class Command(BaseCommand):
    help = "generate random authentic Users (otakus) for testing purposes"
   
    def add_arguments(self, parser):

        parser.add_argument(
            "--users",
            type=int,
            default=20,
        )

    def handle(self, *args, **options):

        n_users = options["users"]
        
        print(f"\n\n generating {n_users} users...\n")

        #animes = Anime.objects.all()
        #animes_to_review = random.sample(list(animes),random.randint(0,animes.count()))

        for i in range(n_users):

            level = random.choice(list(LEVELS))
            User.objects.create( 
                username=f"user_{i}",
                country=random.choice(list(COUNTRIES)),
                level= level,
                points =  LEVELS[level] + random.randint(1,950)
            )
      
        print("\n Done \n")
