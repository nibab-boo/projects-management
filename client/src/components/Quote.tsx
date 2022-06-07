import React from 'react';
import { useNavigate } from 'react-router-dom';
import { asyncFunctionType, onChangeEventType, quoteJsonType, submitEventType } from './Types';

const Quote = () => {
  const navigate = useNavigate();
  const [tempquote, setTempQuote] = React.useState<string>('');
  
  const updateQuote: asyncFunctionType = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") as string
      },
      body: JSON.stringify({ quote: tempquote })
    });

    const data: quoteJsonType = await res.json();
    setTempQuote("");
    if (data.status === "Ok") {
      navigate("/dashboard");
    }
  }
  return (
    <div data-testid="quote">
      <h1>Gift of words to your future self. </h1>
      <form onSubmit={(e:submitEventType) => updateQuote(e)}>
        <input data-testid="input" type="text" placeholder='Your quote' value={tempquote} onChange={(e: onChangeEventType): void=> setTempQuote(e.currentTarget.value)} />
        <input data-testid="input" type="submit" value="SUBMIT" />
      </form>
    </div>
  );
};

export default Quote;