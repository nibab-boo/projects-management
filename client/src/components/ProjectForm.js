import React from 'react';

const ProjectForm = ({update}) => {
  const [name, setName] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [urlLink, setUrlLink] = React.useState('');
  const [repo, setRepo] = React.useState('');
  const [hosting, setHosting] = React.useState('');
  const [stacks, setStacks] = React.useState('');

  const createProject = async (e) => {
    e.preventDefault();
    
    const arrayStack = stacks.split(",").map((stack) => {
      return stack.trim();
    });

    const res = await fetch("http://localhost:1234/api/projects/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({project: {
        name,
        details,
        urlLink,
        repo,
        hosting,
        stacks: arrayStack
      }})
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "Ok") {
      update(data.project)
    }
  }

  return (
    <form onSubmit={(e) => createProject(e)}>
      <input type="text" value={name} name="Name" onChange={(e)=> setName(e.currentTarget.value)} />
      <input type="text" value={details} name="Details" onChange={(e)=> setDetails(e.currentTarget.value)} />
      <input type="text" value={urlLink} name="Live" onChange={(e)=> setUrlLink(e.currentTarget.value)} />
      <input type="text" value={repo} name="Repo" onChange={(e)=> setRepo(e.currentTarget.value)} />
      <input type="text" value={stacks} name="Stacks" onChange={ (e) => setStacks(e.currentTarget.value) } />
      <input type="text" value={hosting} name="hosting" onChange={(e)=> setHosting(e.currentTarget.value)} />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default ProjectForm;