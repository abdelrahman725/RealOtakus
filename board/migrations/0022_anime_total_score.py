# Generated by Django 3.1.4 on 2021-11-01 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0021_auto_20211031_1406'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='total_score',
            field=models.IntegerField(default=0),
        ),
    ]
