import random
from datetime import  datetime
from datetime import  timedelta

from django.core.management.base import BaseCommand

from board.models import *

class Command(BaseCommand):

    help = "generate random authentic questions for testing purposes"
   
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
        contributions =  options["contributions"]
        q_iterator = options["iterator"]
        
        def random_date():
            start = datetime.strptime('1/01/2022 00:00', '%d/%m/%Y %H:%M')
            end= datetime.strptime('22/09/2022 00:00', '%d/%m/%Y %H:%M')
            delta = end - start
            int_delta = (delta.days * 24 * 60 * 60) 
            random_second = random.randrange(int_delta) + delta.seconds
            return start + timedelta(minutes=round(random_second/60))


        def generate_question(anime,question):
            return Question.objects.create(    
                anime = anime,
                question = question,
                right_answer= "right_answer",
                choice1="choice_1",
                choice2="choice_2",
                choice3="choice_3" ,
                date_created = random_date()
            )

        def generate_contribution(question,contributor):

            return Contribution.objects.create(    
                    question = question,
                    contributor=contributor
                )


        print(f"\n\n Creating {n_questions} questions...\n")
        
        animes = Anime.objects.all()
        all_users = User.objects.exclude(is_superuser=True)

        for i in range(q_iterator, q_iterator + n_questions):

            anime = random.choice(animes)

            question = generate_question(
                anime=anime,
                question=f"question_{i} for {anime.anime_name}",
            )

            if contributions:
                generate_contribution(
                    question=question,
                    contributor=random.choice(all_users.exclude(animes_to_review__id=anime.id))
                )
        

        print("\n Done \n")