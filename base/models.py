from django.db import models
from django.urls import reverse

# Create your models here.
class Author(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Category(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)

    class Meta:
        verbose_name = 'Categorie'

    def __str__(self):
        return f"{self.title}"


class Article(models.Model):
    title = models.CharField(max_length=250)
    content = models.TextField()
    slug = models.SlugField(max_length=200)
    date = models.DateField(auto_now=True)
    category = models.ForeignKey(Category,null=True,on_delete=models.SET_NULL,related_name="articles")
    author = models.ForeignKey(Author,null=True,on_delete=models.SET_NULL,related_name="articles")


    class Meta:
        ordering = ('-date','-id',)

    def __str__(self):
        return f"{self.title}"

