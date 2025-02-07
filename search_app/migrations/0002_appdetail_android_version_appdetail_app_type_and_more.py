# Generated by Django 4.2.18 on 2025-01-28 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('search_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appdetail',
            name='android_version',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='app_type',
            field=models.CharField(choices=[('0', '0'), ('Free', 'Free'), ('NaN', 'NaN'), ('Paid', 'Paid')], default='Free', max_length=50),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='content_rating',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='current_version',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='genres',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='price',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='reviews_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appdetail',
            name='size',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='appreview',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appreview',
            name='sentiment',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='appreview',
            name='sentiment_polarity',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='appreview',
            name='sentiment_subjectivity',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='appdetail',
            name='last_updated',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='appdetail',
            name='rating',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='appreview',
            name='review_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
