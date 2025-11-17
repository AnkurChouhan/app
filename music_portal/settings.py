"""
Django settings for music_portal project.
"""

from pathlib import Path
import os

# ==========================================================
# Base directory
# ==========================================================
BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================================
# Security
# ==========================================================
SECRET_KEY = 'django-insecure-34==$p)0+***9+x@_78l@u-r8h&ch%^jjc=d**%_^p0k&q9l1m'
DEBUG = True
ALLOWED_HOSTS = ['*']   # allow local testing

# ==========================================================
# Installed apps
# ==========================================================
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Your apps
    'accounts.apps.AccountsConfig',
    'distribution.apps.DistributionConfig',
    'payments.apps.PaymentsConfig',
    'home',        # <-- REQUIRED for player HTML + API views
    'catalog',     # <-- REQUIRED for Artist/Album/Song/Video models

    # Third-party
    'rest_framework',
]

# ==========================================================
# Middleware
# ==========================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==========================================================
# URL configuration
# ==========================================================
ROOT_URLCONF = 'music_portal.urls'

# ==========================================================
# Templates
# ==========================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        # Global templates folder
        'DIRS': [BASE_DIR / 'templates'],

        # Search in each app/templates
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

# ==========================================================
# WSGI
# ==========================================================
WSGI_APPLICATION = 'music_portal.wsgi.application'

# ==========================================================
# Database
# ==========================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==========================================================
# Password validation
# ==========================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==========================================================
# Internationalization
# ==========================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==========================================================
# Static files (CSS/JS/images)
# ==========================================================
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",   # global static folder
]

STATIC_ROOT = BASE_DIR / "staticfiles"   # for collectstatic

# ==========================================================
# Media files (songs, videos, images uploaded from admin)
# ==========================================================
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

# ==========================================================
# Default primary key type
# ==========================================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==========================================================
# Custom user model
# ==========================================================
AUTH_USER_MODEL = 'accounts.User'
