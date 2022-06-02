import { useNavigate } from 'react-router-dom';
import React from 'react';
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');



const Quote = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = React.useState('');
  const [tempquote, setTempQuote] = React.useState('');

  const updateQuote = async () => {
    console.log(tempquote);
    const res = await fetch("http://localhost:1234/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ quote: tempquote })
    });

    const data = await res.json();
    console.log(data);
    setQuote(data.quote);
    setTempQuote("");
  }


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
        Hello, World!
      </h1>

      <form onClick={()=> updateQuote()}>
        <input type="text" placeholder='Your quote' value={tempquote} onChange={(e)=> setTempQuote(e.currentTarget.value)} />
        <input type="submit" value="SUBMIT" />
      </form>
    </div>
  );
};

export default Quote;