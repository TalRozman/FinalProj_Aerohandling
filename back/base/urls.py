"""myproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
    path('login/changePassword/<id>', views.changePwd),
    path('register/',views.register),
    path('profile/',views.MyProfileView.as_view()),
    path('profile/all/',views.getAllProfiles),
    path('profile/<user>',views.MyProfileView.as_view()),
    path('profile/picture/<user>',views.editPic),
    path('profile/delpicture/<user>',views.delPic),
    path('users/<id>',views.MyUsersView.as_view()),
    path('users/all/',views.getAllUsers),
    path('flights/pull/',views.GetFlights),
    path('flights/',views.MyFlightsView.as_view()),
    path('flights/<id>',views.MyFlightsView.as_view()),
]
