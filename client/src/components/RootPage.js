import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login.tsx';
import Register from './Register';

const RootPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  })
  return (
    <div className='container'>
    <div>
      <h3> Projects Management App</h3>
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