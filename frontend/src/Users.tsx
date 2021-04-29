import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import plus from './icons/plus.svg';
import { BASE_URL } from './config';

interface User {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken') || ''
        },
        credentials: 'include',
      });
      const result = await response.json()

      setUsers(result.users)
    }

    fetchUsers()
  }, []);

  const handleOnClick = async (userId: number) => {
    await fetch(`${BASE_URL}/add-contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken') || ''
      },
      credentials: 'include',
      body: JSON.stringify({ 'user_id': userId })
    });

    window.location.reload();
  }

  return (
    <div>
      {users?.map(user => {
        return (
          <div key={user.id} className="sidebar-user">
            <img className="avatar" src={user.avatar} alt="avatar" />
            {user.full_name}
            <button className="add-contact-button" onClick={() => handleOnClick(user.id)}>
              <img src={plus} alt="add-contact" />
            </button>
          </div>
        );
      })}
    </div >
  );
}
