# Generated by Django 3.1.4 on 2021-09-28 00:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0010_auto_20210928_0231'),
    ]

    operations = [
        migrations.AddField(
            model_name='questions',
            name='choice1',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='questions',
            name='choice2',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='questions',
            name='choice3',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='questions',
            name='right_answer',
            field=models.TextField(null=True),
        ),
        migrations.DeleteModel(
            name='Choices',
        ),
    ]
