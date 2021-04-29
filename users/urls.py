from django.urls import path, include

from . import views


urlpatterns = [
    path('users/', views.users),
    path('users/<int:user_id>', views.user),
    path('current-user/', views.current_user),
    path('contacts/', views.contacts),
    path('add-contact/', views.add_contact)
]
