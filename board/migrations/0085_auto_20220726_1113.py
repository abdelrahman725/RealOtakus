# Generated by Django 3.1.4 on 2022-07-26 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0084_auto_20220726_1052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question',
            field=models.TextField(max_length=350),
        ),
    ]