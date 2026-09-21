from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('brand', 'name', 'category', 'price', 'sale_price', 'created_at')
    list_filter = ('category', 'brand')
    search_fields = ('name', 'brand', 'description')
    ordering = ('-created_at',)