# Generated by Django 5.0.6 on 2024-06-11 11:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_alter_artist_description_alter_music_album_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playlist',
            old_name='descrption',
            new_name='description',
        ),
    ]
