from django.urls import path
from .views import home, placefinder, LandmarkSearchView
# from .views import LandmarkSearchView, index

urlpatterns = [
    path('', home, name='home'), 
    path('placefinder/', placefinder, name='app'),   
    path('api/search/', LandmarkSearchView.as_view(), name='search'),
]