from multiprocessing import context
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView,DetailView
from .models import Article,Category

# Create your views here.

class HomeView(View):

    def get(self, request, *args, **kwargs):
        latests_articles = Article.objects.all()[:20]
        categories = Category.objects.all()
        return render(request,'base/index.html',{
            'latests_articles':latests_articles,
            'categories':categories
        })


# ALL ARTICLES VIEW
class ArticlesView(ListView):
    model = Article
    template_name = 'base/articles.html'
    context_object_name = 'articles'

    def get_context_data(self,*args, **kwargs):
        context = super(ArticlesView, self).get_context_data(*args, **kwargs)
        categories = Category.objects.all()
        context['categories'] = categories
        return context

# SINGLE ARTICLE DETAIL VIEW
class ArticleDetailView(DetailView):
    model = Article
    template_name = 'base/article-detail.html'
    context_object_name = 'article'

    def get_context_data(self,*args, **kwargs):
        context = super(ArticleDetailView,self).get_context_data(*args, **kwargs)
        categories = Category.objects.all()
        context['categories'] = categories
        return context


class CategoryArticles(ListView):
    model = Article
    template_name = 'base/category-articles.html'
    context_object_name = 'category_articles'

    def get_queryset(self):
        qs = super(CategoryArticles, self).get_queryset()
        slug = self.kwargs.get('slug')
        category = Category.objects.get(slug=slug)
        qs = qs.filter(category=category)
        print(qs)
        return qs
    
    def  get_context_data(self,*args,**kwargs):
        context = super(CategoryArticles,self).get_context_data(*args,**kwargs)
        categories = Category.objects.all()
        category = categories.get(slug=self.kwargs['slug'])
        context['categories'] = categories
        context['category'] = category
        return context
