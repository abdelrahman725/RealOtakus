# Generated by Django 3.1.4 on 2021-09-27 11:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0005_auto_20210927_1332'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Answers',
            new_name='Choices',
        ),
    ]
