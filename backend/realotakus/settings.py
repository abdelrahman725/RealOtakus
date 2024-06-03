# import sys
import dotenv

# import dj_database_url
from os import getenv, path
from datetime import timedelta
from pathlib import Path
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env_file = BASE_DIR / ".env"

if path.isfile(env_file):
    dotenv.load_dotenv(env_file)


DEBUG = getenv("DEBUG", "False") == "True"

SECRET_KEY = getenv("SECRET_KEY")

ADMIN_PATH = getenv("ADMIN_PATH")

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS").split(",")

# frontend domain
DOMAIN = getenv("DOMAIN")

SITE_NAME = "RealOtakus"

# to allow requests from react which may have a different origin
CORS_ALLOWED_ORIGINS = getenv("CORS_ALLOWED_ORIGINS").split(",")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [*default_headers, "cache-control"]

AUTH_TOKEN = "access"
# 2 weeks
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 14

# ensure auth cookie is sent over HTTPS (except on localhost)
AUTH_COOKIE_SECURE = getenv("AUTH_COOKIE_SECURE", "True") == "True"
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = "/"
AUTH_COOKIE_SAMESITE = "None"

# email settings
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = getenv("EMAIL_HOST")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = getenv("EMAIL_PASSWORD")
EMAIL_PORT = 465
EMAIL_USE_SSL = True


SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = getenv("GOOGLE_AUTH_CLIENT_ID")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = getenv("GOOGLE_AUTH_SECRET_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

# time (in days) after which notifications should be deleted
NOTIFICATION_LIFE_TIME = 15

# server and browser cache time (in seconds) for all animes (1 hr)
ANIMES_CACHE_TIMEOUT = 60


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "djoser",
    "corsheaders",
    #"social_django",
    "accounts",
    "core",
    "notifications",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "realotakus.custom_middleware.LocalTimezoneMiddleware",
]

ROOT_URLCONF = "realotakus.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "realotakus.wsgi.application"

AUTHENTICATION_BACKENDS = [
    "social_core.backends.google.GoogleOAuth2",
    "django.contrib.auth.backends.ModelBackend",
]

AUTH_USER_MODEL = "core.Otaku"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authentication.CustomJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "max_contributions_per_user": "10/day",
    },
}

DJOSER = {
    "PASSWORD_RESET_CONFIRM_URL": "password-reset/{uid}/{token}",
    "ACTIVATION_URL": "auth/activation/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": True,
    "SOCIAL_AUTH_ALLOWED_REDIRECT_URIS": getenv(
        "SOCIAL_AUTH_ALLOWED_REDIRECT_URIS"
    ).split(","),
    "TOKEN_MODEL": None,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
}

# Default sqlite db is used in production for now
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# if DEBUG == True:
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.sqlite3",
#             "NAME": BASE_DIR / "db.sqlite3",
#         }
#     }
# elif len(sys.argv) > 0 and sys.argv[1] != "collectstatic":
#     if getenv("DATABASE_URL", None) is None:
#         raise Exception("DATABASE_URL environment variable not defined")
#     DATABASES = {
#         "default": dj_database_url.parse(getenv("DATABASE_URL")),
#     }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
