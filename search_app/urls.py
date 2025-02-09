from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import search_apps, submit_review, login_user, register_user, user_details, pending_reviews, \
    logout_user, approve_review, app_details, batch_approve_reviews

urlpatterns = [
    path("login/", login_user, name="api_login"),
    path("register/", register_user, name="api_register"),
    path("user/", user_details),  # ✅ API endpoint for user details
    path("app/<int:app_id>/", app_details, name="app_details"),
    path("search/", search_apps, name="api_search"),
    path("reviews/", pending_reviews, name="pending_reviews"),
    path("review/submit/", submit_review, name="submit_review"),
    path("review/approve/<int:review_id>/", approve_review, name="approve_review"),
    path("reviews/batch-update/", batch_approve_reviews, name="batch_approve_reviews"),
    path("logout/", logout_user, name="api_logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path("reviews/<int:app_id>/", app_reviews, name="api_reviews"),
]
