import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { asyncFunctionType, newEditProjectType, onChangeEventType, submitEventType, projectType } from './Types';

const ProjectForm = ({title, submit}: {title: string, submit: string}): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>('');
  const [details, setDetails] = React.useState<string>('');
  const [urlLink, setUrlLink] = React.useState<string>('');
  const [repo, setRepo] = React.useState<string>('');
  const [hosting, setHosting] = React.useState<string>('');
  const [stacks, setStacks] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('WAITING');


  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate('/');
    } else {
      if (id) {
        fetch(`/api/projects/${id}`,{
          headers: {
            'x-access-token': token,
          }
        }).then(res => res.json())
        .then((data): void => {
          if (data.status === "Ok") {
            const project: projectType = data.project;
            setName(project.name);
            setDetails(project.details);
            setUrlLink(project.urlLink);
            setRepo(project.repoLink);
            setHosting(project.hosting);
            setStacks(project.stacks.join(","));
            setStatus(project.status);
          }
        })
        
      }
  }

  }, [navigate, id])

  const fetchCall = async (url: string, method: string): Promise<void> => {

    const arrayStack: string[] = stacks.split(",").map((stack) => {
      return stack.trim();
    });

    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") as string
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
    const data: newEditProjectType = await res.json();
    if (data.status === "Ok") {
      navigate('/dashboard');
    }
  }

  const projectAction: asyncFunctionType = async (e) => {
    e.preventDefault();

    // IF ID EXIST IN PARAMS, MAKE A UPDATE TO ID ELSE MAKE NEW
    if (id) {
      fetchCall(`/api/projects/${id}`, "PUT")
    } else {
      fetchCall("/api/projects/new", "POST")  
    }
    
  
  }

  return (
    <div className="container px-5 pb-5">
      <h3 className='my-5'>
        {title}
      </h3>
      <form onSubmit={(e:submitEventType) => projectAction(e)}>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingInput" placeholder="Amazing App" type="text" value={name} name="Name" onChange={(e: onChangeEventType): void=> setName(e.currentTarget.value)} />
          <label htmlFor="floatingInput">Name</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingPassword" placeholder="Mern stack app using ...." type="text" value={details} name="Details" onChange={(e: onChangeEventType): void=> setDetails(e.currentTarget.value)}  />
          <label htmlFor="floatingPassword">Details</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingInput" placeholder="www.project.com"  type="text" value={urlLink} name="Live" onChange={(e: onChangeEventType): void=> setUrlLink(e.currentTarget.value)}/>
          <label htmlFor="floatingInput">URL</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingPassword" placeholder="www.github.com/nibab-boo/projectName"  type="text" value={repo} name="Repo" onChange={(e: onChangeEventType): void=> setRepo(e.currentTarget.value)}/>
          <label htmlFor="floatingPassword">Repo</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingInput" placeholder="HTML, CSS, JAVASCRIPT"  type="text" value={stacks} name="Stacks" onChange={ (e) => setStacks(e.currentTarget.value) }/>
          <label htmlFor="floatingInput">Stacks</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" className="form-control" id="floatingPassword" placeholder="Amazon"  type="text" value={hosting} name="hosting" onChange={(e: onChangeEventType): void=> setHosting(e.currentTarget.value)}/>
          <label htmlFor="floatingPassword">Hosting</label>
        </div>
        <select data-testid="input" className="form-select mb-3" name="status" value={status} id="status" onChange={(e: React.ChangeEvent<HTMLSelectElement>):void => setStatus(e.currentTarget.selectedOptions[0].value)}>
          <option value="WAITING">Waiting</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <div className="d-grid gap-2">
          <input data-testid="input" name="submit" type="submit" className='btn btn-warning btn-sm fs-3 fw-bold' value={submit} />
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;