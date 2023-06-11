# Generated by Django 4.1.5 on 2023-05-08 16:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('otakus', '0011_question_approved_question_contributor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='contributor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contributions', to=settings.AUTH_USER_MODEL),
        ),
    ]