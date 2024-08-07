# Generated by Django 5.0.6 on 2024-06-11 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='music',
            name='path',
        ),
        migrations.AlterField(
            model_name='artist',
            name='description',
            field=models.TextField(default='', help_text='Enter a description'),
        ),
        migrations.AlterField(
            model_name='music',
            name='album',
            field=models.CharField(default='', help_text='Enter a album name', max_length=64),
        ),
        migrations.AlterField(
            model_name='music',
            name='genre',
            field=models.CharField(default='', help_text='Enter a genre', max_length=64),
        ),
    ]
