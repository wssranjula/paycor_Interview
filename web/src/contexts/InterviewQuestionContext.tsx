// src/contexts/InterviewQuestionContext.tsx
import React from 'react';

// Define the interface for the context's value
export interface InterviewQuestionContextType {
  questions: string[]; // An array of strings
  setQuestionsArray: (newArray: string[]) => void; // Function to replace the array
}

// Set a default value that matches the interface.
// This is used if a component consumes the context but is not wrapped by the Provider.
// It also helps TypeScript infer the type of the context.
const defaultContextValue: InterviewQuestionContextType = {
  questions: [],
  setQuestionsArray: () => {}, // Empty function for default
};

const InterviewQuestionContext = React.createContext<InterviewQuestionContextType>(defaultContextValue);

export default InterviewQuestionContext;