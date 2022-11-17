# Generated by Django 4.1.2 on 2022-11-17 00:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shoppinglist', '0014_rename_contributor_shoppinglistcontributor'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppinglistentry',
            name='assignee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assignee', to=settings.AUTH_USER_MODEL),
        ),
    ]