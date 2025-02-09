from django.contrib.auth.models import User
from django.db import migrations

def create_superuser(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.create_superuser(
        username="supervisor",
        email="",
        password="Bannu@123"
    )

class Migration(migrations.Migration):
    dependencies = [
        ("search_app", "0008_remove_appreview_status"),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
