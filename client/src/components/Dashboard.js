import { useNavigate } from 'react-router-dom';
import React from 'react';
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');



const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');


  const populateQuote = async () => {
    const res = await fetch("http://localhost:1234/api/login",{
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    });

    const data = await res.json();
    console.log(data);
    console.log("----------------------");
    if (data.status === "Ok") {
      setQuote(data.quote);
    } else {
      alert(data.error)
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        populateQuote();
      }
    }
  }, [navigate])

  return (
    <div>
      <h1>
        { quote || "No quote found."}
        <br />
        <button onClick={ () => navigate("/quote")}>Gift Yourself</button>
        Hello, World!
      </h1>

      
    </div>
  );
};

export default Dashboard;