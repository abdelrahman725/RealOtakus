
# mentors that i will later assign them manually
MENTORS = ()

# number of questions in each quiz users take
QUESTIONSCOUNT = 5

BEGINNER = "beginner"
INTERMEDIATE = "intermediate"
ADVANCED= "advanced"
REALOTAKU= "realOtaku"

#  levels_to_points mapper, shows points users should get to reach each level
LEVELS = {
    BEGINNER: 0,
    INTERMEDIATE: 1000,
    ADVANCED: 3000,
    REALOTAKU: 5000
}


LEVELS_CHOICES = []

for level in LEVELS:
    LEVELS_CHOICES.append((level, level))


NUMBER_OF_LEVELS = len(LEVELS)

# for 'max_length' parameter of the User model definition
MAX_LEVEL_LENGTH = len(max(LEVELS, key=len))
