# Generated by Django 4.1.2 on 2022-11-15 21:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shoppinglist', '0005_alter_shoppinglist_description'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ShoppingList',
        ),
    ]