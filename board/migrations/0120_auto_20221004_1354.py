# Generated by Django 3.1.4 on 2022-10-04 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0119_auto_20221001_2002'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='correct_answers',
        ),
        migrations.RemoveField(
            model_name='question',
            name='wrong_answers',
        ),
        migrations.AlterField(
            model_name='notification',
            name='kind',
            field=models.CharField(blank=True, choices=[('N', 'new anime'), ('R', 'review needed'), ('A', 'question approved'), ('F', 'question rejected')], max_length=1, null=True),
        ),
    ]