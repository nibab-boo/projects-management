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
interface errorType extends status {
  error: "invalid token" | "Action Failed"
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
    name: string,
    details: string,
    urlLink: string,
    repoLink: string,
    hosting: string,
    stacks: string[],
    status: string
}

interface successProjectType {
  project: projectType,
  status: statusType
}

export type projectFetchType = successProjectType | errorType;
