import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import InterviewForm from './components/InterviewForm/InterviewForm';
import UpcomingInterview from './components/UpcomingInteview/UpcomingInterview';
import EditPage from './components/EditPage/EditPage';
import React from 'react';
import axios from "axios";

function App() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(function () {
    try {
      async function getAllUsers() {
        const res = await axios.get("/user");
        setUsers(res.data.data)
      }

      getAllUsers();
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("hello");
        console.log(error.response);
        // Request made and server responded
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        alert(
          `Error (${error.response.status}):\n${error.response.data.error}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.log("response not recieved from server");
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error", error.message);
      }
    }
  },[])
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <div>Hello</div>
            )}
          />
          <Route path="/interview" exact render={() => <InterviewForm users={users}/>} />
          <Route path="/upcoming-interview" exact render={() => <UpcomingInterview/>} />
          <Route path="/edit-interview/:id" exact render={({match}) => <EditPage match={match}/>} />

          
          {/* <Route
            path="/createf"
            exact
            render={({ match }) => (
              <Profile match={match} user={user} setUser={setUser} />
            )}
          /> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
