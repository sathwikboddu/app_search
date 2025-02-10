from django.db import migrations

def update_rating(apps, schema_editor):
    MyModel = apps.get_model('search_app', 'appdetail')  # Replace 'MyModel' with your actual model name
    MyModel.objects.filter(rating='NaN').update(rating=3)  # Update NaN (NULL) values to 3

class Migration(migrations.Migration):

    dependencies = [
        ('search_app', '0010_update_rating_nan'),  # Update with the last migration filename
    ]

    operations = [
        migrations.RunPython(update_rating),
    ]
