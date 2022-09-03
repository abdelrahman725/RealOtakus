# Generated by Django 3.1.4 on 2022-09-03 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0107_notification_kind'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='kind',
            field=models.CharField(blank=True, choices=[('R', 'review needed'), ('A', 'question approved'), ('F', 'question rejected')], max_length=1, null=True),
        ),
    ]