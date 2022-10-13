# Generated by Django 3.1.4 on 2022-10-01 20:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0118_contribution_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questioninteraction',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='questions_interacted_with', to='board.user'),
            preserve_default=False,
        ),
    ]