# Generated by Django 3.1.4 on 2022-08-26 18:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0093_remove_question_change_required'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='reviewer_feedback',
        ),
    ]