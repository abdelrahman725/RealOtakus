# Generated by Django 3.1.4 on 2022-01-04 16:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0029_user_best_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='total_answers',
            field=models.IntegerField(default=0),
        ),
    ]