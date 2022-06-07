import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asyncFunctionType, onChangeEventType, loginJsonType } from './Types';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginUser: asyncFunctionType = async (event) => {
    event.preventDefault();
    const response: Response =  await fetch("/api/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({
        email,
        password
      }),
    })
    const data: loginJsonType = await response.json();
    // console.log(data);
    if (data.user) {
      console.log(data.user);
      alert("Login successful");
      localStorage.setItem("token", data.user);
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
      <form data-testid="login-form" onSubmit={loginUser}>
        <div className="form-floating mb-3">
          <input data-testid="input" type="email" className="form-control" id="floatingEmail" placeholder="email" value={email} onChange={(e: onChangeEventType):void => setEmail(e.currentTarget.value)}/>
          <label htmlFor="floatingEmail">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} autoComplete='on' onChange={(e: onChangeEventType):void => setPassword(e.currentTarget.value)}/>
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="d-grid gap-2">
          <input data-testid="input" type="submit" className='btn btn-warning btn-sm fs-3 fw-bold' value="Log In" />
        </div>
      </form>
    </div>
  );
};

export default Login;