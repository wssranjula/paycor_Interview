// src/contexts/JobTitleContext.tsx
import React from 'react';

// Define the interface for the context's value
export interface JobTitleContextType {
  jobTitle: string; // An array of strings
  setJobTitleString: (newString: string) => void; // Function to replace the array
}

// Set a default value that matches the interface.
// This is used if a component consumes the context but is not wrapped by the Provider.
// It also helps TypeScript infer the type of the context.
const defaultContextValue: JobTitleContextType = {
  jobTitle: '',
  setJobTitleString: () => {}, // Empty function for default
};

const JobTitleContext = React.createContext<JobTitleContextType>(defaultContextValue);

export default JobTitleContext;