import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CvUpload from './CvUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Interview {
  id: string;
  jobTitle: string;
  jobDescription: string;
  customQuestions: string[];
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
  candidatesCount: number;
}

const DynamicCvUpload: React.FC = () => {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  const navigate = useNavigate();
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);

  useEffect(() => {
    // Load interview data from localStorage
    const storedInterview = localStorage.getItem('currentInterview');
    if (storedInterview) {
      const interview = JSON.parse(storedInterview);
      setCurrentInterview(interview);
    } else {
      // If no stored interview, redirect to create interviews page
      navigate('/create-interviews');
    }
  }, [jobSlug, navigate]);

  const handleBackToInterviews = () => {
    navigate('/create-interviews');
  };

  if (!currentInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Interview...</h2>
          <p className="text-gray-600">Please wait while we prepare your interview session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          onClick={handleBackToInterviews}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interviews
        </Button>
      </div>

      {/* Use the existing CvUpload component with dynamic props */}
      <CvUpload 
        jobRole={currentInterview.jobTitle}
        jobDescription={currentInterview.jobDescription}
        customQuestions={currentInterview.customQuestions}
        interviewId={currentInterview.id}
      />
    </div>
  );
};

export default DynamicCvUpload;