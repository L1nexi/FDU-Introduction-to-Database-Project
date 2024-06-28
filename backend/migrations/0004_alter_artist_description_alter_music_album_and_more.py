# Generated by Django 5.0.6 on 2024-06-11 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_alter_artist_description_alter_music_album_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artist',
            name='description',
            field=models.TextField(blank=True, help_text='Enter a description', null=True),
        ),
        migrations.AlterField(
            model_name='music',
            name='album',
            field=models.CharField(blank=True, help_text='Enter a album name', max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='music',
            name='genre',
            field=models.CharField(blank=True, help_text='Enter a genre', max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='music',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='descrption',
            field=models.TextField(blank=True, help_text='Enter a description', null=True),
        ),
    ]
