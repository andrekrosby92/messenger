import { useContext, useState, Fragment } from "react";
import Contacts from "./Contacts";
import { UserContext } from "./UserContext";
import Users from "./Users";

export default function Sidebar() {
  const { full_name, avatar } = useContext(UserContext)
  const [sidebarTab, setSidebarTab] = useState('CONTACTS')

  return (
    <div className="sidebar">
      <div className="current-user">
        <img src={avatar} alt="user-avatar" />
        {full_name}
      </div>
      {sidebarTab === 'CONTACTS' && (
        <Fragment>
          <Contacts />
          <button className="sidebar-button" onClick={() => setSidebarTab('ADD_CONTACT')}>
            Add contacts
          </button>
        </Fragment>
      )}
      {sidebarTab === 'ADD_CONTACT' && (
        <Fragment>
          <Users />
          <button className="sidebar-button" onClick={() => setSidebarTab('CONTACTS')}>
            Back to contacts
          </button>
        </Fragment>
      )}
    </div>
  )
}
