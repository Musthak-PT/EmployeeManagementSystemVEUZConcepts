from django.urls import path
from .views import *

app_name = "formsapp"

urlpatterns = [
    path("", FormListView.as_view(), name="list"),
    path("create/", FormCreateView.as_view(), name="create"),
]