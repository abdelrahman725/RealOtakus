import random

from django.core.management.base import BaseCommand

from ...models import *

class Command(BaseCommand):

    help = "generate random authentic questions for testing purposes"
   
    def add_arguments(self, parser):

        parser.add_argument(
            "--questions",
            type=int,
            default=30,
            help="number of questions to generate",
        )

        parser.add_argument(
            "--state",
            type=str,
            choices=["mixed", "pending"],
            default="pending",
            help="would you like the questions to be pedning (default) or mix of approved and pending",
        )


    def handle(self, *args, **options):
        n_questions = options["questions"]
        question_state = options["state"]
        
        print(f"\n\n start creating {n_questions} questions...\n")
        
        animes = Anime.objects.all()
        all_users = User.objects.exclude(is_superuser=True)

        for i in range(n_questions):
            anime = random.choice(animes)
            Question.objects.create(    
                contributor=random.choice(all_users.exclude(animes_to_review__id=anime.id)),
                anime = anime,
                approved=random.choice([True,False]) if question_state == "mixed" else False,
                question = f"question_{i+1} for {anime.anime_name}",
                right_answer= "right_answer",
                choice1="choice_1",
                choice2="choice_2",
                choice3="choice_3" ,
                advanced= random.choice([True,False])
            )
        print("\n Done \n")