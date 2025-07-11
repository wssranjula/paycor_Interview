// src/contexts/JobTitleProvider.tsx
import React, { useState, useCallback, useMemo, FC } from 'react';
import InterviewerNameContext, { InterviewerNameContextType } from './InterviewerNameContext';

// Define props for the provider if it had any (e.g., initial questions)
interface InterviewerNameProviderProps {
  children: React.ReactNode; // Standard for provider components
}

const InterviewerNameProvider: FC<InterviewerNameProviderProps> = ({ children }) => {
  // State to hold our array of interview questions, explicitly typed as string[]
  const [interviewerName, setInterviewerName] = useState<string>("");

  const setInterviewerNameString = useCallback((newString: string) => {
   
    setInterviewerName(newString);
  }, []);

  // Memoize the context value, ensuring it matches JobTitleContextType
  const contextValue: InterviewerNameContextType = useMemo(() => ({
    interviewerName,
    setInterviewerNameString,
  }), [interviewerName, setInterviewerNameString]);

  return (
    <InterviewerNameContext.Provider value={contextValue}>
      {children}
    </InterviewerNameContext.Provider>
  );
};

export default InterviewerNameProvider;