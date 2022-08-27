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
        
        print(f"\n\n start creating {n_users} users...\n")
        
        animes = Anime.objects.all()

        for i in range(n_users):
            level = random.choice(list(LEVELS))
            User.objects.create( 
                username=f"user_{i}",
                counter=random.choice(list(COUNTRIES)),
                points =  LEVELS[level] + random.randint(1,1000),
                animes_to_review = random.sample(list(animes),random.randint(0,animes.count()))
            )
      
        print("\n Done \n")
