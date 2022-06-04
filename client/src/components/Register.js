import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(event) {
    event.preventDefault();
    const response =  await fetch("/api/register",{
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
      console.log(data.user);
      localStorage.setItem("token", data.user);
      navigate('/dashboard');
    } else if (data.status === "pending") {
      alert("Please try logging in.");
    } else {
      alert("DUPLICATE EMAIL");
    }
  }


  return (
    <div>
      <h3 className='mb-4 text-left'>
        <strong>
          Sign Up
        </strong>
      </h3>
      <form onSubmit={registerUser}>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingInput" placeholder="Adam Christ" value={name} onChange={(e)=> setName(e.currentTarget.value)} />
          <label for="floatingInput">Name</label>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingEmail" placeholder="email" value={email} onChange={(e)=> setEmail(e.currentTarget.value)}/>
          <label for="floatingEmail">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" value={password} autoComplete='on' onChange={(e)=> setPassword(e.currentTarget.value)}/>
          <label for="floatingPassword">Password</label>
        </div>
        <div class="d-grid gap-2">
          <input type="submit" className='btn btn-primary btn-sm fs-3 fw-bold' value="Sign Up" />
        </div>
      </form>
    </div>
  );
};

export default Register;  