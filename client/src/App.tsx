import './App.css';
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RootPage from './components/RootPage.tsx';
import Dashboard from './components/Dashboard';
import Quote from './components/Quote.tsx';
import ProjectForm from './components/ProjectForm.tsx';

function App() {



  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ 
            <>
              <RootPage />
            </>
          }/>
          <Route path="/dashboard" element={ <Dashboard /> }/>
          <Route path="/quote" element={ <Quote /> }/>
          <Route path="/project/new" element={ <ProjectForm submit="Create" title="Create a New Project" /> }/>
          <Route path="/project/edit/:id" element={ <ProjectForm submit="Update" title="Edit the Project" /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
