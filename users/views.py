import json
import uuid
from django.http import JsonResponse

from .models import CustomUser
from chat.models import Room


def users(request):
    users = []

    for user in CustomUser.objects.all():
        if user == request.user:
            continue

        shared_room = user.room_set.all() & request.user.room_set.all()
        shared_room = shared_room.first()

        if shared_room is None:
            users.append({
                'id': user.pk,
                'username': user.email,
                'full_name': user.full_name,
                'avatar': user.avatar
            })

    return JsonResponse({'users': users})


def user(request, user_id):
    user = CustomUser.objects.get(pk=user_id)

    return JsonResponse({
        'id': user.pk,
        'username': user.email,
        'full_name': user.full_name,
        'avatar': user.avatar
    })


def current_user(request):
    user = request.user

    return JsonResponse({
        'id': user.pk,
        'username': user.email,
        'full_name': user.full_name,
        'avatar': user.avatar
    })


def contacts(request):
    contacts = []

    for user in CustomUser.objects.all():
        if user == request.user:
            continue

        shared_room = user.room_set.all() & request.user.room_set.all()
        shared_room = shared_room.first()

        if shared_room is not None:
            contacts.append({
                'id': user.pk,
                'username': user.email,
                'full_name': user.full_name,
                'avatar': user.avatar,
                'room': shared_room.name
            })

    return JsonResponse({'contacts': contacts})


def add_contact(request):
    data = json.loads(request.body)
    contact = CustomUser.objects.get(pk=data['user_id'])
    unique_id = str(uuid.uuid4())
    unique_id = unique_id.replace('-', '')

    room = Room.objects.create(name=unique_id)
    room.users.add(request.user, contact)

    return JsonResponse({'ok': True})
