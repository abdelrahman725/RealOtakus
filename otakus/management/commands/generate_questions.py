import random
import pytz

from django.utils import timezone
from datetime import  datetime
from django.core.management.base import BaseCommand

from otakus.models import User
from otakus.models import Anime
from otakus.models import Question


class Command(BaseCommand):

    help = "generate random contributed questions for testing purposes"
   
    def add_arguments(self, parser):

        parser.add_argument(
            "--questions",
            type=int,
            default=10,
            help="number of questions to generate",
        )

        parser.add_argument(
            "--contributions",
            type=bool,
            default=True,
        )

        parser.add_argument(
            "--iterator",
            type=int,
            default=1,
        )


    def handle(self, *args, **options):
        n_questions = options["questions"]
        questions_are_contributions =  options["contributions"]
        q_iterator = options["iterator"]

        def random_date():
            start = datetime(2020, 1, 1, 0, 0, 0, 0, pytz.UTC)
            end = timezone.now()
            return start + (end - start) * random.random()
        
        def generate_question(anime, contributor, question):
            Question.objects.create( 
                anime = anime,
                contributor = contributor,
                is_contribution = questions_are_contributions,
                question = question,
                right_answer= "right_answer",
                choice1="choice_1",
                choice2="choice_2",
                choice3="choice_3" ,
                date_created = random_date()
            )
        
        
        all_users = User.otakus.all()

        if all_users.count() == 0:
            print("\nplease generate users first\n")
            return
        
        animes = Anime.objects.all()

        print(f"\n\n Creating {n_questions} questions...\n")
        
        for i in range(q_iterator, q_iterator + n_questions):

            anime = random.choice(animes)

            generate_question(
                anime=anime,
                contributor=random.choice(all_users.exclude(animes_to_review__id=anime.id)),
                question=f"question_{i} for {anime.anime_name}",
            )
        

        print("\n Done \n")
        