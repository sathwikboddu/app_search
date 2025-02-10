from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.core.serializers import serialize
from django.db import transaction
from django.shortcuts import get_object_or_404, render
from rapidfuzz import process
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import AppDetail, AppReview
from .serializers import AppSerializer, ReviewInSerializer, ReviewOutSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class ReviewPagination(PageNumberPagination):
    page_size = 10  # Number of reviews per page
    page_size_query_param = 'page_size'
    max_page_size = 100


def serve_react_app(request):
    return render(request, "build/index.html")


# Custom Login View
@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user:
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"id": user.id, "username": user.username}
        })

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# Signup API (Optional)
@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": f"{username} registered successfully"}, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ User must be logged in
def user_details(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_superuser": user.is_superuser,  # ✅ Check if user is a superuser
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ User must be logged in
def app_details(request, app_id):
    # Fetch the app object using the app_id
    app = get_object_or_404(AppDetail, id=app_id)
    serializer = AppSerializer(app)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ User must be logged in
def search_apps(request):
    params = request.GET.get("q", "").strip()

    if len(params) >= 3:
        results = AppDetail.objects.filter(app_name__istartswith=params)
        print(results.query)
        serialized_results = AppSerializer(results, many=True).data
    else:
        serialized_results = []  # ✅ Ensure an empty list if query is less than 3 characters

    return Response(serialized_results)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def app_reviews(request, app_id):
#     # if request.user.is_superuser:
#     #     reviews = AppReview.objects.filter(app_id=app_id)
#     # else:
#     reviews = AppReview.objects.filter(app_id=app_id, is_approved=True).order_by('-created_at')
#     return Response(ReviewSerializer(reviews, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pending_reviews(request):
    is_approved = request.GET.get("is_approved", "").strip()
    query = AppReview.objects.select_related('app')

    if request.user.is_superuser:
        reviews = query.filter(is_approved=is_approved).order_by('-created_at')

    # Manual pagination
    paginator = Paginator(reviews, 10)  # Load 10 reviews per request
    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)

    return Response({
        "results": ReviewOutSerializer(page_obj, many=True).data,
        "next": page_obj.has_next(),
    })


@api_view(["POST"])
def submit_review(request):
    serializer = ReviewInSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(is_approved=False)  # Needs supervisor approval
        return Response({"message": "Review submitted for approval"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def approve_review(request, review_id):
    try:
        review = AppReview.objects.get(id=review_id)
    except AppReview.DoesNotExist:
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

    is_approved = request.data.get("is_approved", None)

    if is_approved is None:
        return Response({"error": "is_approved field is required"}, status=status.HTTP_400_BAD_REQUEST)

    review.is_approved = is_approved
    review.save()

    return Response(
        {"message": "Review approved" if is_approved else "Review rejected"},
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def batch_approve_reviews(request):
    review_ids = request.data.get("review_ids", [])
    is_approved = request.data.get("is_approved", False)

    if not isinstance(review_ids, list) or not review_ids:
        return Response({"error": "A list of reviews is required"}, status=status.HTTP_400_BAD_REQUEST)

    updated_reviews = []
    deleted_reviews = []
    not_found = []

    with transaction.atomic():  # ✅ Ensure atomicity
        if is_approved:
            # ✅ Approve reviews (bulk update for better performance)
            updated_count = AppReview.objects.filter(id__in=review_ids).update(is_approved=True)
            updated_reviews = [{"id": rid, "is_approved": True} for rid in review_ids]
        else:
            # ✅ Delete reviews if not approved (bulk delete for efficiency)
            deleted_count, _ = AppReview.objects.filter(id__in=review_ids).delete()
            deleted_reviews = review_ids  # Return all deleted review IDs

    response_data = {
        "updated": updated_reviews if is_approved else [],
        "deleted": deleted_reviews if not is_approved else [],
        "not_found": not_found,
    }
    return Response(response_data, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
        return Response({"message": "Logged out successfully"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)



# from django.shortcuts import render
# from drf_spectacular.utils import extend_schema, OpenApiParameter
# from rest_framework import status
# from rest_framework.pagination import PageNumberPagination
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView
#
# from search_app.models import AppDetail, AppReview
# from search_app.serializers import AppDetailSerializer, AppReviewSerializer, AppReviewOutSerializer
#
#
# @extend_schema(
#     parameters=[
#         OpenApiParameter(name='query', description="Search term", required=True, type=str),
#         OpenApiParameter(name='page', description="Page Number", required=False, type=int, default=1),
#         OpenApiParameter(name='limit', description="Number of results", required=False, type=int, default=10),
#     ],
#     responses={200: "Success Response"},
# )
#
# class AppSearchView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         # if not request.user.is_authenticated:
#         #     raise AuthenticationFailed('Authentication failed. Please log in.')
#         params = request.query_params.get('query', '')
#         if len(params) < 3:
#             return Response([], status=status.HTTP_200_OK)
#         apps = AppDetail.objects.filter(app_name__icontains=params)
#         # Paginate results
#         paginator = PageNumberPagination()
#         paginated_apps = paginator.paginate_queryset(apps, request)
#
#         # Serialize data
#         serializer = AppDetailSerializer(paginated_apps, many=True)
#
#         return paginator.get_paginated_response(serializer.data)
#
#
# class AppReviewsView(APIView):
#
#     def app_review_list(request):
#         is_superuser = request.user.is_superuser
#         reviews = AppReview.objects.all()
#         return render(request, 'app_review_list.html', {'reviews': reviews, 'is_superuser': is_superuser})
#
#     def get(self, app_id):
#         reviews = AppReview.objects.filter(app_id=app_id, is_approved=True)
#         serializer = AppReviewSerializer(reviews, many=True)
#         return Response(serializer.data)
#
#     @extend_schema(
#         summary="Submit a review for an app",
#         description="Allows a user to submit a review for an app. The review will be sent for approval.",
#         request=AppReviewSerializer,
#         responses={
#             201: AppReviewSerializer,
#             400: "Bad Request"
#         },
#     )
#
#     def post(self, request):
#         data = request.data
#         serializer = AppReviewSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class ReviewApprovalView(APIView):
#     def get(self, app_id):
#         reviews = AppReview.objects.filter(app_id=app_id, is_approved=False)
#         serializer = AppReviewOutSerializer(reviews, many=True)
#         return Response(serializer.data)
#
#     def post(self, request, review_id):
#         review = AppReview.objects.get(id=review_id)
#         review.is_approved = True
#         review.save()
#         return Response({'status': 'approved'}, status=status.HTTP_200_OK)
