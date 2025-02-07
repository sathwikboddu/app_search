from rest_framework import serializers
from .models import AppDetail, AppReview

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppDetail
        fields = ['id', 'app_name']

class ReviewInSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppReview
        fields = "__all__"

class ReviewOutSerializer(serializers.ModelSerializer):
    app_name = serializers.CharField(source='app.app_name')  # Assuming the app model has a 'name' field

    class Meta:
        model = AppReview
        fields = "__all__"



# from rest_framework import serializers
# from .models import AppDetail, AppReview
#
# class AppDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AppDetail
#         fields = ['id', 'app_name']
#
# class AppReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AppReview
#         fields = ['app', 'review_text']
#
#
# class AppReviewOutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AppReview
#         fields = ['app', 'review_text', 'status']
#
