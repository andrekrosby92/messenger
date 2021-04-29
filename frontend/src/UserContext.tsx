import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { BASE_URL } from './config';

interface User {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
}

export const UserContext = createContext<Partial<User>>({})

export default function UserProvider(props: any) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: '',
    full_name: '',
    avatar: ''
  })

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await fetch(`${BASE_URL}/current-user/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken') || ''
        },
        credentials: 'include',
      });

      const result = await response.json()
      setCurrentUser(result)
    }

    fetchCurrentUser()
  }, []);

  return (
    <UserContext.Provider value={{ ...currentUser! }}>
      {props.children}
    </UserContext.Provider>
  )
}
