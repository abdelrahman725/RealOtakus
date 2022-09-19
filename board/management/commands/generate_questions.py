import random
from datetime import  datetime
from random import randrange
from datetime import timedelta

from django.core.management.base import BaseCommand

from ...models import *

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
            "--state",
            type=str,
            choices=["mixed", "pending"],
            default="pending",
            help="would you like the questions to be pedning (default) or mix of approved and pending",
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
        question_state = options["state"]
        contributions =  options["contributions"]
        q_iterator = options["iterator"]
        
        def random_date():
            start = datetime.strptime('1/01/2022 00:00', '%d/%m/%Y %H:%M')
            end= datetime.strptime('3/09/2022 00:00', '%d/%m/%Y %H:%M')
            delta = end - start
            int_delta = (delta.days * 24 * 60 * 60) 
            random_second = randrange(int_delta) + delta.seconds
            return start + timedelta(minutes=round(random_second/60))


        def generate_question(anime,question):
            return Question.objects.create(    
                anime = anime,
                approved=random.choice([True,False]) if question_state == "mixed" else False,
                question = question,
                right_answer= "right_answer",
                choice1="choice_1",
                choice2="choice_2",
                choice3="choice_3" ,
                advanced= random.choice([True,False]),
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