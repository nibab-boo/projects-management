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
    if (data.status === "Ok") {
      setQuote(data.quote);
      const newProjects = data.projects;
      setProjects([...newProjects]);
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
  };

  // DELETING PROJECT FROM USER
  const deleteProject = async (id) => {
    const res = await fetch(`http://localhost:1234/api/projects/${id}/delete`, {
      method: "DELETE",
      headers: { "x-access-token": localStorage.getItem("token") }
    })

    const data = await res.json();
    // console.log(data);
    if (data.status === "Ok") {
      const newProjects = projects.filter((project) => project._id !== data.id)
      console.log(projects, newProjects)
      setProjects([...newProjects]);
    }

  }

  const Projects = ({projectList}) => {
    return(
      <>
      {projectList.map((project) => {
        return (
        <div key={project._id} >
          <h4>{project.name}</h4>
          <p>{project.details}</p>
          <p>{project.repo}</p>
          <p>{project.urlLink}</p>
          <ul style={{listStyle: "inside"}}>
            { project.stacks.map((stack) => (
              <li>{stack}</li>
            ))}
          </ul>
          <p>{project.hosting}</p>
          <button onClick={() => deleteProject(project._id)}>DELETE THIS PROJECT</button>
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
          (<Projects projectList={projects}/>)
        }
      </div>
      
    </div>
  );
};

export default Dashboard;