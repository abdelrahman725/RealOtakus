# Generated by Django 3.1.4 on 2022-07-08 22:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0073_auto_20220706_1940'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='review',
        ),
    ]