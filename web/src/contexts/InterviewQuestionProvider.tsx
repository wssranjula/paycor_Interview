// src/contexts/InterviewQuestionProvider.tsx
import React, { useState, useCallback, useMemo, FC } from 'react';
import InterviewQuestionContext, { InterviewQuestionContextType } from './InterviewQuestionContext';

// Define props for the provider if it had any (e.g., initial questions)
interface InterviewQuestionProviderProps {
  children: React.ReactNode; // Standard for provider components
}

const InterviewQuestionProvider: FC<InterviewQuestionProviderProps> = ({ children }) => {
  // State to hold our array of interview questions, explicitly typed as string[]
  const [questions, setQuestions] = useState<string[]>([]);

  // Function to replace the entire questions array
  // newArray is explicitly typed as string[]
  const setQuestionsArray = useCallback((newArray: string[]) => {
    // if (Array.isArray(newArray)) {
    //   // Filter out any non-string or empty items and ensure they are strings
    //   setQuestions(newArray.filter((q): q is string => typeof q === 'string' && q.trim() !== ''));
    // } else {
    //   console.warn("setQuestionsArray expects an array of strings.");
    // }
    setQuestions(newArray);
  }, []);

  // Memoize the context value, ensuring it matches InterviewQuestionContextType
  const contextValue: InterviewQuestionContextType = useMemo(() => ({
    questions,
    setQuestionsArray,
  }), [questions, setQuestionsArray]);

  return (
    <InterviewQuestionContext.Provider value={contextValue}>
      {children}
    </InterviewQuestionContext.Provider>
  );
};

export default InterviewQuestionProvider;