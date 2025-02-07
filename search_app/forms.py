from django import forms
from .models import AppReview


class ReviewForm(forms.ModelForm):
    class Meta:
        model = AppReview
        fields = ['review_text', 'rating']