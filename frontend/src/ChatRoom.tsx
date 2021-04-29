import React, { useContext, useEffect, useState, useRef } from 'react'
import { ChatRoomContext } from './ChatRoomContext'
import ChatUser from './ChatUser'
import { UserContext } from './UserContext'
import send from './icons/send.svg';

interface Messages {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export default function ChatRoom() {
  const chatUserId = getURLParams('user_id');
  const { socket } = useContext(ChatRoomContext)
  const { username } = useContext(UserContext)
  const [messages, setMessages] = useState<Messages[]>([])
  const [message, setMessage] = useState('')

  const chatRoomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chatRoom = chatRoomRef.current
    chatRoom?.scrollTo(0, chatRoom.scrollHeight)
  }, [messages])


  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ 'command': 'fetch_messages' }));
    }

    socket.onmessage = (e: any) => {
      const data = JSON.parse(e.data);

      if (data.message.command === 'messages') {
        setMessages(data.message.messages)
      } else if (data.message.command === 'message') {
        setMessages((prev: any) => [...prev, data.message.message]);
      }
    };

    socket.onclose = function (e: any) {
      console.error('Chat socket closed unexpectedly');
    };

    return () => socket?.close();
  }, [socket]);



  const handleOnClick = () => {
    socket.send(JSON.stringify({
      'message': message,
      'command': 'new_message'
    }));

    setMessage('');
  }

  return (
    <div className="chat">
      <ChatUser userId={chatUserId!} />
      <div className="chat-room" ref={chatRoomRef}>
        {messages?.map(message => {
          if (username === message.author) {
            return (
              <div key={message.id} className="message sender">
                <div className="text">{message.content}</div>
                <small className="timestamp">{renderTimestamp(message.timestamp)}</small>
              </div>
            )
          } else {
            return (
              <div key={message.id} className="message receiver">
                <div className="text">{message.content}</div>
                <small className="timestamp">{renderTimestamp(message.timestamp)}</small>
              </div>
            )
          }
        })}
      </div>
      <div className="chat-message">
        <input
          className="chat-message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="chat-message-button" onClick={handleOnClick}>
          <img src={send} alt="send" />
        </button>
      </div>
    </div>
  )
}

function getURLParams(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function renderTimestamp(timestamp: string) {
  let prefix = '';
  const timeDiff = Math.round(
    (new Date().getTime() - new Date(timestamp).getTime()) / 60000
  );
  if (timeDiff < 1) {
    prefix = 'Just now';
  } else if (timeDiff < 60 && timeDiff >= 1) {
    prefix = `${timeDiff} minutes ago`;
  } else if (timeDiff < 24 * 60 && timeDiff >= 60) {
    prefix = `${Math.round(timeDiff / 60)} hours ago`;
  } else if (timeDiff < 31 * 24 * 60 && timeDiff >= 24 * 60) {
    prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
  } else {
    prefix = `${new Date(timestamp)}`;
  }
  return prefix;
};