# Generated by Django 3.1.4 on 2022-04-15 07:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0055_remove_anime_questions_number'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'ordering': ['-points']},
        ),
        migrations.AddField(
            model_name='notification',
            name='seen',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='anime_review',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='board.anime'),
        ),
    ]