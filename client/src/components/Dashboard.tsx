import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { deleteJsonType, projectType, statusChangeJsonType, userFetchJsonType } from "./Types";
const jwt = require('jsonwebtoken');

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState<string>('');
  const [username, setUserName] = React.useState<string>('');
  const [projects, setProjects] = React.useState<projectType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);


  const populateQuote = async (): Promise<void> => {
    const res = await fetch("/api/user",{
      method: "GET",
      headers: {
        "Accept": "application/json", 
        "x-access-token": localStorage.getItem("token")
      }
    });
    const data: userFetchJsonType = await res.json();
    if (data.status === "Ok") {
      setQuote(data.quote);
      setUserName(data.username);
      const newProjects = data.projects;
      setProjects([...newProjects]);
    } else {
      navigate("/");
    }
    setLoading(() => false);
  }

  React.useEffect(() => {
    const token: string = localStorage.getItem('token');
    const fetchData = async (): Promise<void> => {
      if (token) {
        const user = jwt.decode(token);
        console.log(user);
        if (!user) {
          localStorage.removeItem('token');
          navigate("/");
        } else {
          await populateQuote();
        }
      } else {
        navigate("/")
      }
    }
    fetchData()
    .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  // DELETING PROJECT FROM USER
  const deleteProject = async (id: string): Promise<void> => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { "x-access-token": localStorage.getItem("token") }
    })

    const data: deleteJsonType = await res.json();
    if (data.status === "Ok") {
      const newProjects = projects.filter((project) => project._id !== data.id)
      console.log(projects, newProjects)
      setProjects([...newProjects]);
    }
  }

  // CHANGE STATUS
  const changeStatus = async (id: string, status: string): Promise<void> => {

    const res = await fetch(`/api/projects/${id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ status: status }),
    })

    const data: statusChangeJsonType = await res.json();
    console.log(data);
    if (data.status === "Ok") {
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

  const editProject = (id: string): void => {
    navigate(`/project/edit/${id}`);
  }

  const logOut = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  }

  const Projects = ({projectList}: {projectList: projectType[]}): JSX.Element => {
    return(
      <>
      {projectList.map((project) => {
        return (
        <div key={project._id} className="shadow p-3 mb-5 m-5 bg-body rounded" style={{textAlign: "left", width: "300px"}} >
          <h4>{project.name}</h4>
          <p style={{color: "gray"}}>{project.details}</p>
          <li>
            <span className='me-3'>
              STATUS: {project.status}
            </span>
            { project.status === "WAITING" &&
              (
                <button className='btn btn-sm btn-outline-primary' onClick={(): Promise<void> => changeStatus(project._id, "ONGOING")}>
                  Let's Start
                </button>
              )
            }
            { project.status === "ONGOING" &&
              (
                <button className='btn btn-sm btn-outline-primary' onClick={(): Promise<void> => changeStatus(project._id, "COMPLETED")}>
                  Mark as Completed
                </button>
              )
            }
          </li>
          {/* <div className='border p-2 pb-0 mb-2'> */}
            <li>REPO: <a target="_blank" href={project.repoLink} rel="noreferrer"> {project.repoLink} </a></li>
            <li>LIVE: <a target="_blank" href={project.urlLink} rel="noreferrer"> {project.urlLink} </a></li>
          {/* </div> */}
          <li>STACKS</li>
          <ul style={{listStyle: "inside"}} className="border p-2 rounded">
            { project.stacks.map((stack) => (
              <li key={stack} className='d-inline-block pe-3'>{stack}</li>
            ))}
          </ul>
          <p>HOSTING: {project.hosting}</p>
          <div style={{float: "right"}}>
            <button className='btn btn-sm btn-warning mx-1' onClick={(): void => editProject(project._id)}>EDIT</button>
            <button className='btn btn-sm btn-danger mx-1' onClick={(): Promise<void> => deleteProject(project._id)}>DELETE</button>
          </div>
        </div>)
      })
    }
    </>
    )
  }

  return (
    <>
    <div className='d-flex flex-md-column'>
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
          <div style={{borderRadius: "16px"}}className='p-2 mx-5 my-3 bg-danger text-white' onClick={():void => logOut()}>Log Out</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='py-3 px-5' style={{marginLeft: "180px"}}>
        
        <h1 className='mb-5'>
          You have {projects.length} projects.
        </h1>
        <div className='d-flex flex-wrap'>
          { projects &&
            (<Projects projectList={projects}/>)
          }
        </div>
        
      </div>
    </div>
    <ClipLoader color="purple" speedMultiplier={.5} loading={loading} size={150} />
    </>
  );
};

export default Dashboard;