import './App.css';
// import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import Quote from './components/Quote';
function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" exact element={ <Login /> }/>
          <Route path="/register" exact element={ <Register /> }/>
          <Route path="/dashboard" exact element={ <Quote /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
