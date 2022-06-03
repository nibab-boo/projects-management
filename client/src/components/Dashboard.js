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

  const editProject = (id) => {
    navigate(`/project/edit/${id}`);
  }

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  const Projects = ({projectList}) => {
    return(
      <>
      {projectList.map((project) => {
        return (
        <div key={project._id} className="shadow p-3 mb-5 bg-body rounded" style={{textAlign: "left"}} >
          <h4>{project.name}</h4>
          <p style={{color: "gray"}}>{project.details}</p>
          <p>
            <span className='me-3'>
              STATUS: {project.status}
            </span>
            { project.status === "WAITING" &&
              (
                <button className='btn btn-sm btn-outline-primary' onClick={() => changeStatus(project._id, "ONGOING")}>
                  Let's Start
                </button>
              )
            }
            { project.status === "ONGOING" &&
              (
                <button className='btn btn-sm btn-outline-primary' onClick={() => changeStatus(project._id, "COMPLETED")}>
                  Mark as Completed
                </button>
              )
            }
          </p>
          <div className='border p-2 pb-0 mb-2'>
            <p>REPO: <a target="_blank" href={project.repoLink} rel="noreferrer"> {project.repoLink} </a></p>
            <p>LIVE: <a target="_blank" href={project.urlLink} rel="noreferrer"> {project.urlLink} </a></p>
          </div>
          <p>STACKS</p>
          <ul style={{listStyle: "inside"}} className="border p-2 rounded">
            { project.stacks.map((stack) => (
              <li className='d-inline pe-3'>{stack}</li>
            ))}
          </ul>
          <p>HOSTING: {project.hosting}</p>
          <div style={{float: "right"}}>
            <button className='btn btn-sm btn-warning mx-1' onClick={() => editProject(project._id)}>EDIT</button>
            <button className='btn btn-sm btn-danger mx-1' onClick={() => deleteProject(project._id)}>DELETE</button>
          </div>
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
            <li className='' onClick={ () => navigate("/project/new") }>Add Project</li>
          </ul>
          <div style={{borderRadius: "16px"}}className='p-2 mx-5 my-3 bg-danger text-white' onClick={() => logOut()}>Log Out</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='py-3 px-5'>
        
        <h1 className='mb-5'>
          You have {projects.length} projects.
        </h1>
        <div className=''>
          { projects &&
            (<Projects projectList={projects}/>)
          }
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;