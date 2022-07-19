
# mentors that i will later assign them manually
MENTORS = ()

# number of questions in each quiz users take
QUESTIONSCOUNT = 5

# points users should gain to reach each level
 
INTERMEDIATE_POINTS = 1000
ADVANCED_POINTS     = 3000
REALOTAKU_POINTS    = 5000


# Available levels for a user
LEVELS = (
    "beginner",
    "intermediate",
    "advanced",
    "realOtaku"
)

LEVELS_OPTIONS = []

for level in LEVELS:
    LEVELS_OPTIONS.append((level,level))



NUMBER_OF_LEVELS = len(LEVELS)

# for 'max_length' parameter of the User model definition 
MAX_LEVEL_LENGTH = len(max(LEVELS,key=len))