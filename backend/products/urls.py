from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # auth
    path('register/', register),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),

    # product
    path('products/', get_products),
    path('products/create/', create_product),
    path('products/<int:pk>/', get_product),
    path('products/<int:pk>/update/', update_product),
    path('products/<int:pk>/delete/', delete_product),

    # cart
    path('cart/', get_cart),
    path('cart/add/', add_to_cart),
    path('cart/remove/<int:pk>/', remove_from_cart),

    # order
    path('order/checkout/', checkout),
    path('order/history/', get_user_orders),

    # ai
    path('ai/ask/', ask_ai),
]