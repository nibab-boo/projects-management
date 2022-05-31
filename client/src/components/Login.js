import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser(event) {
    event.preventDefault();
    const response =  await fetch("http://localhost:1234/api/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({
        email,
        password
      }),
    })
    const data = await response.json();
    console.log(data);
  }
  return (
    <div>
      <h1>
        Login
      </h1>
      <form onSubmit={loginUser}>
        <input type="email" placeholder="email" onChange={(e)=> setEmail(e.currentTarget.value)} />
        <br/>
        <input type="password" placeholder="password" autoComplete='on' onChange={(e)=> setPassword(e.currentTarget.value)} />
        <input type="submit" value="Log in" />
      </form>
    </div>
  );
};

export default Login;