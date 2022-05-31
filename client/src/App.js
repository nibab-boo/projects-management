import './App.css';
import { useState } from "react"

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(event) {
    event.preventDefault();
    const response =  await fetch("http://localhost:1234/api/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({
        name,
        email,
        password
      }),
    })
    const data = await response.json();
    console.log(data);
  }


  return (
    <div className="App">
      <h1>
        Register
      </h1>
      <form onSubmit={registerUser}>
        <input type="text" placeholder="name" onChange={()=> setName(this.value)} /><br/>
        <input type="email" placeholder="email" onChange={()=> setEmail(this.value)} />
        <br/>
        <input type="password" placeholder="password" onChange={()=> setPassword(this.value)} />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
