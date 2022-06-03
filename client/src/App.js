import './App.css';
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RootPage from './components/RootPage';
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
              <RootPage />
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
