import './App.css';
// import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Quote from './components/Quote';
import ProjectForm from './components/ProjectForm';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={ 
            <>
            <div className='container'>
              <div>
                <h3> Projects Management App</h3>
                <p className='mt-3'>
                  <strong>Record your app ideas and working project in a organized way</strong>
                </p>
              </div>
              <div className='d-flex justify-content-evenly p-5 my-5 shadow bg-body rounded'>
                <Register />
                <Login />
              </div>
            </div>
            </>
          }/>
          <Route path="/dashboard" exact element={ <Dashboard /> }/>
          <Route path="/quote" exact element={ <Quote /> }/>
          <Route path="/project/new" exact element={ <ProjectForm submit="Create" title="Create a New Project" /> }/>
          <Route path="/project/edit/:id" exact element={ <ProjectForm submit="Update" title="Edit the Project" /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
