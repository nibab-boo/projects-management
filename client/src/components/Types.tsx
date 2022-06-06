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

// ERROR TYPE
interface errorType {
  status: "error",
  error: "invalid token" | "Action Failed" | "Delete process unfulfilledd" | "Please, retry again"
}

// QUOTE SUCCESS STORY
interface quoteSuccessType extends status {
  quote: string
}

export type quoteJsonType = errorType | quoteSuccessType;

// new/edit project response
export interface newEditProjectType extends status {
  error?: string
}

// project jsonType
export type projectType = {
    _id: string,
    name: string,
    details: string,
    urlLink: string,
    repoLink: string,
    hosting: string,
    stacks: string[],
    status: string
}


// DASHBOARD user Fetch
interface successUserJsonType {
  status: "Ok",
  username: string,
  quote: string,
  projects: projectType[],
}

export type userFetchJsonType = successUserJsonType | errorType;

// DELETE JSON TYPE
interface deleteSuccessType {
  status: "Ok",
  id: string,
}

export type deleteJsonType = deleteSuccessType | errorType;


// CHANGE STATUS
interface statusChangeSuccessType {
  status: "Ok",
  project: projectType,
}

export type statusChangeJsonType = statusChangeSuccessType | errorType;
