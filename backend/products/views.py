from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import transaction

from .models import Product, Cart, CartItem, Order, OrderItem, ProductReview
from .serializers import (
    ProductSerializer, 
    CartSerializer, 
    CartItemSerializer, 
    OrderSerializer,
    UserSerializer,
    ProductReviewSerializer
)
from .ai_service import get_ai_response

# ================== PRODUCT ==================

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_products(request):
    category = request.query_params.get('category')
    if category:
        products = Product.objects.filter(category__iexact=category)
    else:
        products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_product(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def create_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([AllowAny]) 
def update_product(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(instance=product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([AllowAny]) 
def delete_product(request, pk):
    product = get_object_or_404(Product, id=pk)
    product.delete()
    return Response({'message': 'Product was deleted'})

@api_view(['POST'])
@permission_classes([AllowAny])
def add_product_review(request, pk):
    product = get_object_or_404(Product, id=pk)
    data = request.data.copy()
    data['product'] = product.id
    if request.user.is_authenticated:
        data['user'] = request.user.id
        data['reviewer_name'] = request.user.username
    serializer = ProductReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# ================== CART ==================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny]) # Supporting anonymous temporary cart would need session logic, but keeping it simple
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    product = get_object_or_404(Product, id=product_id)
    
    if not request.user.is_authenticated:
        return Response({'error': 'Please login to use cart'}, status=401)
        
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not item_created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity
    cart_item.save()
    
    return Response({'message': 'Item added to cart'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, pk):
    cart_item = get_object_or_404(CartItem, id=pk, cart__user=request.user)
    cart_item.delete()
    return Response({'message': 'Item removed from cart'})

# ================== ORDER / GUEST CHECKOUT ==================

@api_view(['POST'])
@permission_classes([AllowAny])
def checkout(request):
    # Support both logged-in users (from cart) and guests (from direct post data)
    items_data = request.data.get('items', [])
    full_name = request.data.get('full_name')
    email = request.data.get('email')
    address = request.data.get('address')
    phone = request.data.get('phone')
    payment_method = request.data.get('payment_method', 'COD')

    if not items_data and not request.user.is_authenticated:
        return Response({'error': 'No items to purchase'}, status=400)
    
    with transaction.atomic():
        total_price = 0
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            full_name=full_name,
            email=email,
            address=address,
            phone=phone,
            payment_method=payment_method,
            total_price=0 # update later
        )

        # If logged in user and no direct items, use cart
        if request.user.is_authenticated and not items_data:
            cart = get_object_or_404(Cart, user=request.user)
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order, product=item.product, 
                    price=item.product.price, quantity=item.quantity
                )
                total_price += item.product.price * item.quantity
                item.product.stock -= item.quantity
                item.product.save()
            cart.items.all().delete()
        else:
            # Guest or explicit items
            for item in items_data:
                product = get_object_or_404(Product, id=item['product_id'])
                qty = int(item['quantity'])
                OrderItem.objects.create(
                    order=order, product=product,
                    price=product.price, quantity=qty
                )
                total_price += product.price * qty
                product.stock -= qty
                product.save()
        
        order.total_price = total_price
        order.save()
        
    return Response(OrderSerializer(order).data, status=201)

# ================== AUTH ==================

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User created successfully', 'user': UserSerializer(user).data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# ================== AI CHAT ==================

@api_view(['POST'])
@permission_classes([AllowAny])
def ask_ai(request):
    user_query = request.data.get('query')
    chat_history = request.data.get('history', [])
    
    if not user_query:
        return Response({'error': 'No query provided'}, status=400)
    
    response = get_ai_response(user_query, chat_history)
    return Response({'response': response})