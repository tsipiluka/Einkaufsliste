# Generated by Django 4.1.2 on 2022-12-13 23:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0002_friend_friend_reject_friend_request_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend',
            name='friend_reject',
        ),
    ]
