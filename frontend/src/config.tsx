import Cookies from 'js-cookie'

export const BASE_URL = (
  window.location.href.includes('localhost') ?
    'http://localhost:8000' :
    'https://<APP>.herokuapp.com'
)

export const SOCKET_BASE_PATH = (
  window.location.href.includes('localhost') ?
    'ws://localhost:8000' :
    'wss://<APP>.herokuapp.com'
)

export const CREDENTIALS = (
  window.location.href.includes('localhost:3000') ?
    'include' :
    'same-origin'
)

export const REQUEST_OPTIONS = {
  credentials: CREDENTIALS,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  },
}