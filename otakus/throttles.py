from rest_framework.throttling import UserRateThrottle


class ContributionRateThrottle(UserRateThrottle):
    scope = "max_contributions"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)
