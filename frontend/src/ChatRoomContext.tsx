import React, { createContext } from 'react'
import { useParams } from 'react-router'
import { SOCKET_BASE_PATH } from './config';

export const ChatRoomContext = createContext<any>(null)

interface Params {
  room: string;
}

interface Props {
  children: JSX.Element,
}

export default function ChatRoomProvider(props: Props) {
  const { room } = useParams<Params>()
  const socket = new WebSocket(`${SOCKET_BASE_PATH}/ws/chat/${room}/`);

  return (
    <ChatRoomContext.Provider value={{ socket }}>
      {props.children}
    </ChatRoomContext.Provider>
  )
}
