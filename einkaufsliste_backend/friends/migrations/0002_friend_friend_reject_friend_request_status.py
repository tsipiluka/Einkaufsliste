# Generated by Django 4.1.2 on 2022-12-13 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='friend',
            name='friend_reject',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='friend',
            name='request_status',
            field=models.BooleanField(default=False),
        ),
    ]