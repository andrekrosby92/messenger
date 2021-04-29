import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BASE_URL } from './config';

interface ChatUserState {
  username: string;
  full_name: string;
  avatar: string;
}

interface Props {
  userId: string;
}

export default function ChatUser(props: Props) {
  const [chatUser, setChatUser] = useState<ChatUserState>()

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(BASE_URL + '/users/' + props.userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken') || ''
        },
        credentials: 'include',
      });

      const result = await response.json()
      setChatUser(result)
    }

    fetchUser()
  }, [props.userId])

  return (
    <div className="chat-user">
      <img className="avatar" src={chatUser?.avatar} alt="avatar" />
      {chatUser?.full_name}
    </div>
  )
}
