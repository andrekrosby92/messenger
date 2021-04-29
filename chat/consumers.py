import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core import serializers
from django.db.models import Q

from .models import Message, Room
from users.models import CustomUser


class ChatConsumer(WebsocketConsumer):
    # Fetch messages on render
    def fetch_messages(self, data):
        user = self.scope['user']
        user_rooms = user.room_set.all()
        room = Room.objects.get(name=self.room_name)

        if room in user_rooms:
            messages = Message.objects.order_by('timestamp').filter(room=room)
            messages = self.serialize_messages(messages)

            self.send_messages({
                'command': 'messages',
                'messages': messages
            })

    def send_messages(self, message):
        self.send(text_data=json.dumps({'message': message}))

    # Send a new message
    def new_message(self, data):
        author = self.scope["user"]
        room = Room.objects.get(name=self.room_name)

        if author.is_authenticated:
            message = Message.objects.create(
                author=author,
                room=room,
                content=data['message'])

            return self.send_chat_message({
                'command': 'message',
                'message': self.serialize_message(message)
            })

    def serialize_messages(self, messages):
        result = []
        for message in messages:
            result.append(self.serialize_message(message))
        return result

    def serialize_message(self, message):
        return {
            'id': message.pk,
            'author': message.author.email,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        command = self.commands[data['command']]
        command(self, data)

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({'message': message}))
