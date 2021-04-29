import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import ChatRoomProvider from "./ChatRoomContext";
import UserProvider from "./UserContext";
import Sidebar from "./Sidebar";
import Register from "./Register";

export default function App() {

  return (
    <Router>
      <UserProvider>
        <div className="app">
          <Switch>
            <Route path="/chat">
              <Sidebar />
              <Switch>
                <Route path="/chat/:room">
                  <ChatRoomProvider>
                    <ChatRoom />
                  </ChatRoomProvider>
                </Route>
              </Switch>
            </Route>
            <Route path="/">
              <Register />
            </Route>
          </Switch>
        </div>
      </UserProvider>
    </Router>
  );
}