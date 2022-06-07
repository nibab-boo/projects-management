import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asyncFunctionType, onChangeEventType, registerJsonType } from './Types';

const Register = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const registerUser: asyncFunctionType = async (event) => {
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
    const data: registerJsonType = await response.json();
    console.log(data);
    if (data.status === "Ok") {
      console.log(data.user);
      localStorage.setItem("token", data.user);
      navigate('/dashboard');
    } else if (data.status === "Pending") {
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
      <form onSubmit={registerUser} data-testid="register-form">
        <div className="form-floating mb-3">
          <input data-testid="input" type="text" className="form-control" id="floatingInput" placeholder="Adam Christ" value={name} onChange={(e:onChangeEventType): void=> setName(e.currentTarget.value)} />
          <label htmlFor="floatingInput">Name</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" type="email" className="form-control" id="floatingEmail" placeholder="email" value={email} onChange={(e:onChangeEventType): void=> setEmail(e.currentTarget.value)}/>
          <label htmlFor="floatingEmail">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input data-testid="input" type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} autoComplete='on' onChange={(e:onChangeEventType): void=> setPassword(e.currentTarget.value)}/>
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="d-grid gap-2">
          <input data-testid="input" type="submit" className='btn btn-primary btn-sm fs-3 fw-bold' value="Sign Up" />
        </div>
      </form>
    </div>
  );
};

export default Register;  