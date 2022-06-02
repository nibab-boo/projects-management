import ProjectForm from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const jwt = require('jsonwebtoken');


const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');
  const [projects, setProjects] = React.useState([]);


  const populateQuote = async () => {
    const res = await fetch("http://localhost:1234/api/login",{
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    });

    const data = await res.json();
    console.log(data);
    console.log("----------------------");
    if (data.status === "Ok") {
      setQuote(data.quote);
      setProjects(()=> (data.projects))
    } else {
      alert(data.error)
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        populateQuote();
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const updateProjects = (newProject) => {
    setProjects([...projects, newProject]);
  } 

  const Projects = ({projects}) => {
    console.log(typeof(projects));
    return(
      <>
      {projects.map((project) => {
        return (<div>
        <h4>{project.name}</h4>
        <p>{project.details}</p>
        <p>{project.repo}</p>
        <p>{project.urlLink}</p>
        <p>{project.hosting}</p>
      </div>)
      })
    }
    </>
    )
  }

  return (
    <div>
      <h1>
        { quote || "No quote found."}
        <br />
        <button onClick={ () => navigate("/quote")}>Gift Yourself</button>
        Hello, World!
      </h1>
      <div>
        <ProjectForm update={updateProjects} />
      </div>
      <div>
        { projects &&
          (<Projects projects={projects}/>)
        }
      </div>
      
    </div>
  );
};

export default Dashboard;