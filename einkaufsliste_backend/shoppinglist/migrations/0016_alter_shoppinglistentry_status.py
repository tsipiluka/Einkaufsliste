# Generated by Django 4.1.2 on 2022-11-17 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shoppinglist", "0015_shoppinglistentry_assignee"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shoppinglistentry",
            name="status",
            field=models.BooleanField(default=False),
        ),
    ]
