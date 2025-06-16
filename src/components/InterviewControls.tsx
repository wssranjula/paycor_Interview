
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

interface InterviewControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onFinishInterview: () => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const InterviewControls: React.FC<InterviewControlsProps> = ({
  currentQuestion,
  totalQuestions,
  onNextQuestion,
  onFinishInterview,
  isListening,
  setIsListening,
}) => {
  const handleNextClick = () => {
    setIsListening(false);
    setTimeout(() => {
      onNextQuestion();
    }, 500);
  };

  const handleFinishClick = () => {
    setIsListening(false);
    onFinishInterview();
  };

  const isLastQuestion = currentQuestion >= totalQuestions;

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-2">
          Ready to move on? Click below when you've finished your response.
        </p>
      </div>
      
      <div className="flex gap-3">
        {!isLastQuestion ? (
          <Button
            onClick={handleNextClick}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6"
            disabled={!isListening}
          >
            Next Question
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinishClick}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6"
            disabled={!isListening}
          >
            Finish Interview
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewControls;
