from rest_framework.throttling import UserRateThrottle


class ContributionRateThrottle(UserRateThrottle):
    scope = "max_contributions_per_user"
