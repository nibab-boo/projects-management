import React from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import Login from './Login.tsx';
// @ts-ignore
import Register from './Register.tsx';

const RootPage = (): JSX.Element => {
  const navigate = useNavigate();
  const token: string | null = localStorage.getItem("token");

  React.useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  })
  return (
    <div className='container'>
    <div>
      <h3 data-testid="main-title"> Projects Management App</h3>
      <p className='mt-3'>
        <strong>Record your app ideas and working project in a organized way</strong>
      </p>
    </div>
    <div className='d-flex justify-content-evenly p-5 my-5 shadow bg-body rounded'>
      <Register />
      <Login />
    </div>
  </div>
  );
};

export default RootPage;