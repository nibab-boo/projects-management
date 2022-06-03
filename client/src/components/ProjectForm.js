import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectForm = ({title, submit}) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [urlLink, setUrlLink] = React.useState('');
  const [repo, setRepo] = React.useState('');
  const [hosting, setHosting] = React.useState('');
  const [stacks, setStacks] = React.useState('');
  const [status, setStatus] = React.useState('WAITING');

  const createProject = async (e) => {
    e.preventDefault();

    const arrayStack = stacks.split(",").map((stack) => {
      return stack.trim();
    });

    const res = await fetch("/api/projects/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({project: {
        name,
        details,
        urlLink,  
        repoLink: repo,
        hosting,
        status,
        stacks: arrayStack
      }})
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "Ok") {
      navigate('/dashboard');
    }
  }

  return (
    <div className="container px-5 pb-5">
      <h3 className='my-5'>
        {title}
      </h3>
      <form onSubmit={(e) => createProject(e)}>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingInput" placeholder="Amazing App" type="text" value={name} name="Name" onChange={(e)=> setName(e.currentTarget.value)} />
          <label for="floatingInput">Name</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingPassword" placeholder="Mern stack app using ...." type="text" value={details} name="Details" onChange={(e)=> setDetails(e.currentTarget.value)}  />
          <label for="floatingPassword">Details</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingInput" placeholder="www.project.com"  type="text" value={urlLink} name="Live" onChange={(e)=> setUrlLink(e.currentTarget.value)}/>
          <label for="floatingInput">URL</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingPassword" placeholder="www.github.com/nibab-boo/projectName"  type="text" value={repo} name="Repo" onChange={(e)=> setRepo(e.currentTarget.value)}/>
          <label for="floatingPassword">Repo</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingInput" placeholder="HTML, CSS, JAVASCRIPT"  type="text" value={stacks} name="Stacks" onChange={ (e) => setStacks(e.currentTarget.value) }/>
          <label for="floatingInput">Stacks</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" id="floatingPassword" placeholder="Amazon"  type="text" value={hosting} name="hosting" onChange={(e)=> setHosting(e.currentTarget.value)}/>
          <label for="floatingPassword">Hosting</label>
        </div>
        <select class="form-select mb-3" name="status" defaultValue="WAITING" id="status" onChange={(e) => setStatus(e.currentTarget.selectedOptions[0].value)}>
          <option value="WAITING">Waiting</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <div class="d-grid gap-2">
          <input type="submit" className='btn btn-warning btn-sm fs-3 fw-bold' value={submit} />
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;