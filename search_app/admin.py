# from django.contrib import admin
# from .models import AppDetail, AppReview
#
#
# @admin.register(AppDetail)
# class AppDetailAdmin(admin.ModelAdmin):
#     list_display = ('app_name', 'category', 'rating', 'reviews_count')  # Fields to display in the list view
#     list_filter = ('app_name', 'category')  # Filters to use in the admin panel
#     search_fields = ('app_name',)  # Searchable fields
#     list_per_page = 20
#
#
# # Registering AppReview model to display in the admin panel
# @admin.register(AppReview)
# class AppReviewAdmin(admin.ModelAdmin):
#     list_display = ('app', 'user', 'status', 'review_text')  # Fields to display in the list view
#     list_filter = ('status', 'app')  # Filters to use in the admin panel
#     search_fields = ('review_text', 'user')  # Searchable fields
#     ordering = ('-status',)  # Default ordering by status
#     list_per_page = 20