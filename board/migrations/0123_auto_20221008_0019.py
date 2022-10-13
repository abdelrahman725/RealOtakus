# Generated by Django 3.1.4 on 2022-10-08 00:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0122_game'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='tests_completed',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='tests_started',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]