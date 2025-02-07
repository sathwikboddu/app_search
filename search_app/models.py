from django.db import models
from django.utils.timezone import now


class AppDetail(models.Model):
    app_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    rating = models.FloatField(null=True, blank=True)
    reviews_count = models.CharField(max_length=50, null=True, blank=True)
    size = models.CharField(max_length=50, default='')
    installs = models.CharField(max_length=50)
    app_type = models.CharField(max_length=50, choices=[('0', '0'), ('Free', 'Free'), ('NaN', 'NaN'), ('Paid', 'Paid')],
                                default='Free')
    price = models.CharField(max_length=50, null=True, blank=True)
    content_rating = models.CharField(max_length=50, null=True, blank=True)
    genres = models.CharField(max_length=255, null=True, blank=True)
    last_updated = models.DateField(null=True, blank=True)
    current_version = models.CharField(max_length=100, null=True, blank=True)
    android_version = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.app_name


class AppReview(models.Model):
    app = models.ForeignKey(AppDetail, on_delete=models.CASCADE, related_name='reviews')
    review_text = models.TextField(null=True, blank=True)
    user = models.CharField(max_length=255)
    sentiment = models.CharField(max_length=50,  choices=[('Positive', 'Positive'), ('Negative', 'Negative'),
                                                          ('Neutral', 'Neutral'), ('nan', 'nan')], default='Neutral')
    sentiment_polarity = models.CharField(max_length=50, null=True, blank=True)
    sentiment_subjectivity = models.CharField(max_length=50, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    # status = models.CharField(max_length=50, choices=[('Pending', 'Pending'), ('Approved', 'Approved')], default='Pending')
    created_at = models.DateTimeField(default=now)
    def __str__(self):
        return f"{self.user} - {self.status}"
