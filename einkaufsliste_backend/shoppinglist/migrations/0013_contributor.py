# Generated by Django 4.1.2 on 2022-11-15 22:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shoppinglist', '0012_alter_shoppinglist_owner'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contributor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('shopping_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shoppinglist.shoppinglist')),
            ],
        ),
    ]