import React from "react";

type submitEventType = React.FormEvent;

// COMES WITH VOID RETURN
export type onChangeEventType = React.FormEvent<HTMLInputElement>;

export type asyncFunctionType = (e: submitEventType) => Promise<void>;


// RESPONSE TYPES
type status =  "Ok" | "error";

export type loginJsonType = {
  status: status,
  user: false | string
}

// Register type
export type registerJsonType = {
  status: status | "Pending",
  user?: "string",
  error?: "Duplicate email" 
}