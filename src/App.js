import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import WelcomePage from "./welcomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";

import { Switch, Route, NavLink } from "react-router-dom";
import AddCoursePage from "./addCourse";

function Header({ loggedIn, role }) {
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="selected" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="selected" to="/LoginPage">
            {loggedIn ? <>Logout</> : <>Login</>}
          </NavLink>
        </li>

        <li>
          <NavLink activeClassName="selected" to="/allCourses">
            All Courses
          </NavLink>
        </li>

        {loggedIn && (
          <li>
            <NavLink activeClassName="selected" to="/NewCourse">
              Add New Course
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

function Home() {
  return <WelcomePage />;
}

function LoginPage({ setLoggedIn, loggedIn, setRole }) {
  const [loggedInError, setLoggedInError] = useState("");

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };
  const login = (user, pass) => {
    facade
      .login(user, pass)
      .then((res) => setLoggedIn(true))
      .catch((err) => err.fullError)
      .then((data) => setLoggedInError(data));
  };

  if (loggedInError) {
    return (
      <div>
        <LogIn login={login} />
        <h3>{loggedInError.message}</h3>
      </div>
    );
  }

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn setRole={setRole} />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function AllCoursesPage() {
  // Const er en form for hook. Den laver en variabel som kan arbejde med resultatet efter rendering.
  const [fetchData, setFetchData] = useState([]);

  useEffect(() => {
    facade.fetchCourses().then((data) => setFetchData(data));
    //Tomt array betyder at den kun renderes én gang, og kun en gang.
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course-Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{MapCourses(fetchData)}</tbody>
    </Table>
  );

  function MapCourses(fetchData) {
    return fetchData.map((data) => {
      return (
        <tr>
          <td>{data.courseName}</td>
          <td>{data.description}</td>
        </tr>
      );
    });
  }
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = (evt) => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input type="password" placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
function LoggedIn({ setRole }) {
  const [dataFromServer, setDataFromServer] = useState("");
  const jwt = require("jsonwebtoken");
  const token = localStorage.getItem("jwtToken");
  const role = jwt.decode(token).roles;

  let roleToFetch = role;
  if (roleToFetch === "admin,user") {
    roleToFetch = "admin";
  }
  useEffect(() => {
    facade.fetchData(roleToFetch).then((data) => setDataFromServer(data.msg));
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <h3>Role: {role}</h3>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState();

  return (
    <div>
      <Header loggedIn={loggedIn} role={role} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/LoginPage">
          <LoginPage
            setLoggedIn={setLoggedIn}
            setRole={setRole}
            loggedIn={loggedIn}
          />
        </Route>

        <Route exact path="/allCourses">
          <AllCoursesPage />
        </Route>

        <Route exact path="/NewCourse">
          <AddCoursePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
