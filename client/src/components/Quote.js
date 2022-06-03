import React from 'react';
import { useNavigate } from 'react-router-dom';

const Quote = () => {
  const navigate = useNavigate();
  const [tempquote, setTempQuote] = React.useState('');
  
  const updateQuote = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ quote: tempquote })
    });

    const data = await res.json();
    console.log(data);
    setTempQuote("");
    if (data.status === "Ok") {
      navigate("/dashboard");
    }
  }
  return (
    <div>
      <h1>Gift of words to your future self. </h1>
      <form onSubmit={(e)=> updateQuote(e)}>
        <input type="text" placeholder='Your quote' value={tempquote} onChange={(e)=> setTempQuote(e.currentTarget.value)} />
        <input type="submit" value="SUBMIT" />
      </form>
    </div>
  );
};

export default Quote;