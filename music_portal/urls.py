from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # home & dashboard
    path('', include('home.urls')),

    # login / signup / profile
    path('accounts/', include('accounts.urls')),

    # payments
    path('payments/', include('payments.urls')),

    # ⭐ NEW: Catalog (Songs, Albums, Artists, Videos + API + Player Page)
    path('music/', include('catalog.urls')),
]

# Serve media files in development (audio, video, covers, avatars)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
