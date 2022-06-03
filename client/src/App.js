import './App.css';
// import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Quote from './components/Quote';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={ 
            <>
              <div>
                <Link to="/login">LOGIN</Link>
                <Link to="/register">register</Link>
                <Link to="/dashboard">dashboard</Link>
              </div>
              <div>
                <Register />
                <Login />
              </div>
            </>
          }/>
          <Route path="/dashboard" exact element={ <Dashboard /> }/>
          <Route path="/quote" exact element={ <Quote /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
