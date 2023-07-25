from apscheduler.schedulers.background import BackgroundScheduler
from otakus.helpers import delete_expired_notifications

# scheduler for deleting notifications older than one month


def start():
    print("\n notifications scheduler started \n")
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_notifications, "interval", days=15)
    scheduler.start()
