import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
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
    if (data.status === "Ok") {
      navigate("/login");
    }
  }


  return (
    <div>
      <h1>
        Register
      </h1>
      <form onSubmit={registerUser}>
        <input type="text" placeholder="name" onChange={(e)=> setName(e.currentTarget.value)} /><br/>
        <input type="email" placeholder="email" onChange={(e)=> setEmail(e.currentTarget.value)} />
        <br/>
        <input type="password" placeholder="password" autoComplete='on' onChange={(e)=> setPassword(e.currentTarget.value)} />
        <input type="submit" value="Sign in" />
      </form>
    </div>
  );
};

export default Register;