import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser(event) {
    event.preventDefault();
    const response =  await fetch("/api/login",{
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
    // console.log(data);
    if (data.user) {
      console.log(data.user);
      alert("Login successful");
      localStorage.setItem("token", data.user);
      // window.location.href = "/quote";
      navigate("/dashboard");
    } else {
      alert("Please check your username and password");
    }
  }
  return (
    <div>
      <h3 className='mb-4 text-left'>
        <strong>
          Log In
        </strong>
      </h3>
      <form onSubmit={loginUser}>
      <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingEmail" placeholder="email" value={email} onChange={(e)=> setEmail(e.currentTarget.value)}/>
          <label for="floatingEmail">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" autoComplete="on" id="floatingPassword" placeholder="Password" value={password} autoComplete='on' onChange={(e)=> setPassword(e.currentTarget.value)}/>
          <label for="floatingPassword">Password</label>
        </div>
        <div class="d-grid gap-2">
          <input type="submit" className='btn btn-warning btn-sm fs-3 fw-bold' value="Log In" />
        </div>
      </form>
    </div>
  );
};

export default Login;