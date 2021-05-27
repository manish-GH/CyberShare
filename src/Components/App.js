import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Switch, Route, useHistory } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import SignUp from "./SignUp";
import { Profile } from "./Profile";

function App() {
  const history = useHistory();
  const { currentUser } = useAuth();
  useEffect(() => {
    history.push(!!currentUser ? "/" : "/login");
  }, [currentUser, history]);

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/profile/:username" component={Profile} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
