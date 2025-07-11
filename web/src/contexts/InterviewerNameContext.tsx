import React from 'react';

// Define the interface for the context's value
export interface InterviewerNameContextType {
  interviewerName: string;
  setInterviewerNameString: (newString: string) => void;
}

const defaultContextValue: InterviewerNameContextType = {
  interviewerName: '',
  setInterviewerNameString: () => {}, // Empty function for default
};

const InterviewerNameContext = React.createContext<InterviewerNameContextType>(defaultContextValue);

export default InterviewerNameContext;