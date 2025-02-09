import os
import django
import csv
from datetime import datetime

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app_search.settings')
django.setup()


from search_app.models import AppDetail, AppReview


# Define relative paths
archive_folder = os.path.join(os.path.dirname(__file__), 'archive')

# Access files
googlestore_path = os.path.join(archive_folder, 'googleplaystore.csv')
reviews_path = os.path.join(archive_folder, 'googleplaystore_user_reviews.csv')

# Load apps from googleplaystore.csv
def load_apps(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if not AppDetail.objects.filter(app_name=row['App']).first():
                AppDetail.objects.create(
                    app_name=row['App'],
                    category=row['Category'],
                    rating=row['Rating'] if row['Rating'] != 'Nan' else None ,
                    reviews_count=row['Reviews'],
                    size=row['Size'],
                    installs=row['Installs'],
                    app_type=row['Type'],
                    price=row['Price'],
                    content_rating=row['Content Rating'],
                    genres=row['Genres'],
                    current_version=row['Current Ver'],
                    android_version=row['Android Ver']
                )
    print("Apps data loaded successfully.")

# Load reviews from googleplaystore_user_reviews.csv
def load_reviews(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            app = AppDetail.objects.filter(app_name=row['App']).first()
            if app:
                AppReview.objects.create(
                    app=app,
                    review_text=row['Translated_Review'],
                    sentiment=row['Sentiment'],
                    sentiment_polarity=row['Sentiment'],
                    sentiment_subjectivity=row['Sentiment']
                )
    print("Reviews data loaded successfully.")


# Run loaders
load_apps(googlestore_path)
load_reviews(reviews_path)
