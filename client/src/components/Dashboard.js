import ProjectForm from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const jwt = require('jsonwebtoken');


const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');
  const [projects, setProjects] = React.useState([]);


  const populateQuote = async () => {
    console.log("4");
    const res = await fetch("/api/user",{
      headers: {
        "Accept": "application/json", 
        "x-access-token": localStorage.getItem("token")
      }
    });
    console.log("5");
    console.log("response", res);
    const data = await res.json();
    console.log("data", data);
    if (data.status === "Ok") {
      setQuote(data.quote);
      console.log("ok");
      const newProjects = data.projects;
      setProjects([...newProjects]);
    } else {
      alert(data.error)
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("1");
    const fetchData = async () => {
      if (token) {
        const user = jwt.decode(token);
        if (!user) {
          console.log("A");
          localStorage.removeItem('token');
          navigate("/login");
        } else {
          console.log("2");
          await populateQuote();
        }
      } else {
        navigate("/login")
      }
    }
    fetchData()
    .catch(console.error);
  }, [navigate])

  const updateProjects = (newProject) => {
    setProjects([...projects, newProject]);
  };

  // DELETING PROJECT FROM USER
  const deleteProject = async (id) => {
    const res = await fetch(`/api/projects/${id}/delete`, {
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

  // CHANGE STATUS
  const changeStatus = async (id, status) => {
    console.log("id", id);
    console.log("status", status);
    const res = await fetch(`/api/projects/${id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ status: status }),
    })

    const data = await res.json();
    console.log(data);
    if (data.status === "Ok") {
      // console.log("hello");
      const updatedProjects = projects.map((project) => {
        if (project._id !== data.project._id) return project;
        return data.project;
      })
      console.log(updatedProjects);
      setProjects([...updatedProjects]);
    } else {
      alert(data.error);
    }
  } 

  const Projects = ({projectList}) => {
    return(
      <>
      {projectList.map((project) => {
        return (
        <div key={project._id} >
          <h4>Name: {project.name}</h4>
          <p>Details: {project.details}</p>
          <p>
            Status: {project.status}
            { project.status === "WAITING" &&
              (
                <button onClick={() => changeStatus(project._id, "ONGOING")}>
                  Let's Start
                </button>
              )
            }
            { project.status === "ONGOING" &&
              (
                <button onClick={() => changeStatus(project._id, "COMPLETED")}>
                  Mark as Completed
                </button>
              )
            }
          </p>
          <p>Repo: <a href={project.repoLink}> REPO </a></p>
          <p>Live: <a href={project.urlLink}> LIVE </a></p>
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