# Generated by Django 4.2.4 on 2023-10-21 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_question_feedback'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='choice1',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice2',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice3',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='right_answer',
            field=models.CharField(max_length=200),
        ),
    ]
