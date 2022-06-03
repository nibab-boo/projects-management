import ProjectForm from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const jwt = require('jsonwebtoken');


const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');
  const [username, setUserName] = React.useState('');
  const [projects, setProjects] = React.useState([]);


  const populateQuote = async () => {
    console.log("4");
    const res = await fetch("/api/user",{
      method: "GET",
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
      setUserName(data.username);
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
          navigate("/");
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
    <div className='d-flex'>
      {/* LEFT SIDES */}
      <div className='leftSide'>
        <div>
            <h4 className='mb-3'>
              <strong>
                Hi {username}!
              </strong>
            </h4>
            <div className='fs-6' style={{color: "rgba(0, 11, 73, .67)"}}>
              <strong>
                { quote }
              </strong>
            </div>
          </div>
        <div>
          <ul>
            <li className=''  onClick={ () => navigate("/quote")}>Change Gift</li>
            <li className=''>Add Project</li>
          </ul>
          <div style={{borderRadius: "16px"}}className='p-2 mx-5 my-3 bg-danger text-white'>Log Out</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='p-3'>
        
        <h1>
          You have {projects.length} projects.
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
    </div>
  );
};

export default Dashboard;