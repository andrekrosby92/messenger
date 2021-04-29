import React, { useState } from 'react'
import { BASE_URL } from './config';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';

export default function Register() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')

  let history = useHistory()

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !password) {
      return;
    }

    await fetch(`${BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken') || ''
      },
      credentials: 'include',
      body: JSON.stringify({
        'email': email,
        'first_name': firstName,
        'last_name': lastName,
        'password': password,
      })
    });

    history.push('/chat');
    window.location.reload();
  }

  return (
    <form onSubmit={handleOnSubmit} className="register-form">
      <div className="register-input">
        <label htmlFor="email">Epost</label>
        <input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="register-input">
        <label htmlFor="email">Fornavn</label>
        <input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
      <div className="register-input">
        <label htmlFor="email">Etternavn</label>
        <input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
      <div className="register-input">
        <label htmlFor="email">Passord</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Registrer</button>
    </form>
  )
}
