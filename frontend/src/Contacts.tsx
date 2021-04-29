import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BASE_URL } from './config';


interface Contact {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
  room: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    async function fetchContacts() {
      const response = await fetch(BASE_URL + '/contacts/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken') || ''
        },
        credentials: 'include',
      });

      const result = await response.json()
      setContacts(result.contacts)
    }

    fetchContacts()
  }, []);

  return (
    <div>
      {contacts?.map(contact => {
        return (
          <Link
            key={contact.id}
            className="sidebar-user contact"
            to={`/chat/${contact.room}?user_id=${contact.id}`}>
            <img className="avatar" src={contact.avatar} alt="avatar" />
            <div className="text">
              <div className="name">{contact.full_name}</div>
              <div className="last-message">Last message</div>
            </div>
          </Link>
        )
      })}
    </div >
  );
}
