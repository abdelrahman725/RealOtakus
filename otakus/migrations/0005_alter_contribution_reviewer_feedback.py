# Generated by Django 4.1.5 on 2023-02-02 01:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('otakus', '0004_alter_user_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contribution',
            name='reviewer_feedback',
            field=models.CharField(blank=True, choices=[('irr', 'not relevant'), ('dup', 'duplicate'), ('eas', 'too easy'), ('bad', 'bad choices'), ('inv', 'invalid/wrong information')], max_length=50, null=True),
        ),
    ]
