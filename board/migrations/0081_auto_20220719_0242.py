# Generated by Django 3.1.4 on 2022-07-19 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0080_auto_20220719_0141'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='level',
            field=models.CharField(choices=[('beginner', 'beginner'), ('intermediate', 'intermediate'), ('advanced', 'advanced'), ('realOtaku', 'realOtaku')], default='beginner', max_length=12),
        ),
    ]
