// src/contexts/JobTitleProvider.tsx
import React, { useState, useCallback, useMemo, FC } from 'react';
import JobTitleContext, { JobTitleContextType } from './JobTitleContext';

// Define props for the provider if it had any (e.g., initial questions)
interface JobTitleProviderProps {
  children: React.ReactNode; // Standard for provider components
}

const JobTitleProvider: FC<JobTitleProviderProps> = ({ children }) => {
  // State to hold our array of interview questions, explicitly typed as string[]
  const [jobTitle, setJobTitle] = useState<string>("");

  // Function to replace the entire questions array
  // newArray is explicitly typed as string[]
  const setJobTitleString = useCallback((newString: string) => {
    // if (Array.isArray(newArray)) {
    //   // Filter out any non-string or empty items and ensure they are strings
    //   setQuestions(newArray.filter((q): q is string => typeof q === 'string' && q.trim() !== ''));
    // } else {
    //   console.warn("setQuestionsArray expects an array of strings.");
    // }
    setJobTitle(newString);
  }, []);

  // Memoize the context value, ensuring it matches JobTitleContextType
  const contextValue: JobTitleContextType = useMemo(() => ({
    jobTitle,
    setJobTitleString,
  }), [jobTitle, setJobTitleString]);

  return (
    <JobTitleContext.Provider value={contextValue}>
      {children}
    </JobTitleContext.Provider>
  );
};

export default JobTitleProvider;