# Generated by Django 3.1.4 on 2022-08-29 00:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0100_auto_20220828_2155'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contribution',
            name='reviewer',
        ),
    ]
