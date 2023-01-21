from django.urls import path
from . import views

app_name = 'base'

urlpatterns = [
    path('',views.HomeView.as_view(),name='index'),
    path('articles/',views.ArticlesView.as_view(),name='articles'),
    path('articles/<slug:slug>/',views.ArticleDetailView.as_view(),name='article_detail'),
    path('<slug:slug>/',views.CategoryArticles.as_view(),name='category_articles')
]