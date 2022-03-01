# Generated by Django 3.1.4 on 2022-02-26 07:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0033_auto_20220226_0553'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='contributer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contributions', to=settings.AUTH_USER_MODEL),
        ),
    ]