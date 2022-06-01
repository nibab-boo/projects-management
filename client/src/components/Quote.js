import { useNavigate } from 'react-router-dom';
import React from 'react';
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');



const Quote = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');

  const populateQuote = async () => {
    const res = await fetch("http://localhost:1234/api/quote",{
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    });

    const data = await res.json();
    // console.log(data);
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
    <h1>
      { quote || "No quote found."}
      <br />
      Hello, World!
    </h1>
  );
};

export default Quote;