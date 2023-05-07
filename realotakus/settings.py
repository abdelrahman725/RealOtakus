import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.getenv('PRODUCTION', '') != 'True'

SECRET_KEY = 'django-insecure-1n%6p0^_2dg8sa23ogituq*x$r_+%oy$i*loop=mf@umrsvzqm' if DEBUG == True else os.getenv('SECRET_KEY')

ADMIN_PANEL_PATH = os.getenv('ADMIN_PATH','admin/') 

ALLOWED_HOSTS = ["127.0.0.1", os.getenv('HOST')]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:8000"] if DEBUG == True else ["http://127.0.0.1:8000", os.getenv('SITE_URL')]

LOGIN_REDIRECT_URL = '/'

SOCIALACCOUNT_EMAIL_REQUIRED = True

SOCIALACCOUNT_QUERY_EMAIL = SOCIALACCOUNT_EMAIL_REQUIRED

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.getenv('HOST_EMAIL')
EMAIL_HOST_PASSWORD = os.getenv('HOST_EMAIL_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('HOST_EMAIL')
EMAIL_PORT = 587
EMAIL_USE_TLS = True


INSTALLED_APPS = [
    'otakus',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
    #'channels',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google'
]
    
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'realotakus.custom_middleware.LocalTimezoneMiddleware'
]



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS':  [os.path.join(BASE_DIR, 'app/build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_USER_MODEL = "otakus.User"

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
     ],

     'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        #'rest_framework.permissions.AllowAny'
    ],

}

ASGI_APPLICATION = 'realotakus.asgi.application'

WSGI_APPLICATION = 'realotakus.wsgi.application'

ROOT_URLCONF = 'realotakus.urls'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


REDIS_URL = os.getenv('REDIS_URL')


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
    } if DEBUG == True
    
    else {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': REDIS_URL
    }
} 


CHANNEL_LAYERS =  {   
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'      
    } if DEBUG == True
    
    else {  
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(REDIS_URL)],
        }
    }
} 

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    os.path.join(os.path.join(BASE_DIR, 'app'), 'build', 'static'),
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
