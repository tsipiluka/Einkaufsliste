# Generated by Django 4.1.2 on 2022-11-16 23:43

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("shoppinglist", "0013_contributor"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Contributor", new_name="ShoppingListContributor",
        ),
    ]
