import React from "react";

export type submitEventType = React.FormEvent;

// COMES WITH VOID RETURN
export type onChangeEventType = React.FormEvent<HTMLInputElement>;

export type asyncFunctionType = (e: submitEventType) => Promise<void>;


// RESPONSE TYPES
type statusType = "Ok" | "error";

interface status {
  status: statusType,
}

// login Json return
export interface loginJsonType extends status {
  user: false | string
}

// register Json return
export type registerJsonType = {
  status: statusType | "Pending",
  user?: "string",
  error?: "Duplicate email" 
}

interface quoteErrorType extends status {
  error: "invalid token"
}
interface quoteSuccessType extends status {
  quote: string
}

export type quoteJsonType = quoteErrorType | quoteSuccessType;
