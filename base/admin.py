from django.contrib import admin
from .models import Category,Author,Article

# Register your models here.
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title','date','author']
    prepopulated_fields = {"slug": ("title",)}

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

admin.site.register(Author)
admin.site.register(Category,CategoryAdmin)
admin.site.register(Article,ArticleAdmin)