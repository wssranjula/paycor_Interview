import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import VideoFeed from '@/components/VideoFeed';
import InterviewControls from '@/components/InterviewControls';
import SummaryModal from '@/components/SummaryModal';
import { Mic, MicOff, Video, VideoOff, ArrowLeft } from 'lucide-react';
import SmartHireLogo from "../assets/SmartHireLogo.png";

import InterviewQuestionContext, { InterviewQuestionContextType } from '../contexts/InterviewQuestionContext';
import JobTitleContext, {JobTitleContextType} from '@/contexts/JobTitleContext';
import InterviewerNameContext, {InterviewerNameContextType} from '@/contexts/InterviewerNameContext';

interface Interview {
  id: string;
  guid: string;
  jobTitle: string;
  jobDescription: string;
  customQuestions: string[];
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
  candidatesCount: number;
}

const DynamicInterview: React.FC = () => {
  const { interviewGuid } = useParams<{ interviewGuid: string }>();
  const navigate = useNavigate();
  
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [welcomeSpeechPlayed, setWelcomeSpeechPlayed] = useState(false);
  const [answeredArray, setAnsweredArray] = useState<any[]>([]);
  const [evaluationAnsweredArray, setEvaluationAnsweredArray] = useState<any>({
    "individualEvaluations": [],
    "overallEvaluation": {
        "rating": "",
        "summary": "",
        "strengths": [],
        "areasForImprovement": [],
    }
  });
  const [isEvaluating, setEvaluating] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);

  const { questions, setQuestionsArray }: InterviewQuestionContextType = useContext(InterviewQuestionContext);
  const { setJobTitleString }: JobTitleContextType = useContext(JobTitleContext);
  const { interviewerName, setInterviewerNameString }: InterviewerNameContextType = useContext(InterviewerNameContext);
  
  const totalQuestions = questions.length;

  const currentQuestionText = questions[currentQuestion - 1] || "Loading next question...";
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  // Load interview data from localStorage
  useEffect(() => {
    // Try to load from localStorage first (for direct navigation from CV upload)
    const storedInterview = localStorage.getItem('currentInterview');
    if (storedInterview) {
      const interview = JSON.parse(storedInterview);
      if (interview.guid === interviewGuid) {
        setCurrentInterview(interview);
        setJobTitleString(interview.jobTitle);
        return;
      }
    }

    // If not found in localStorage, search in saved interviews by GUID
    const savedInterviews = localStorage.getItem('smartHireInterviews');
    if (savedInterviews && interviewGuid) {
      const interviews = JSON.parse(savedInterviews);
      const foundInterview = interviews.find((interview: Interview) => interview.guid === interviewGuid);
      
      if (foundInterview) {
        setCurrentInterview(foundInterview);
        setJobTitleString(foundInterview.jobTitle);
        localStorage.setItem('currentInterview', JSON.stringify(foundInterview));
      } else {
        // Interview not found, redirect to create interviews page
        navigate('/create-interviews');
      }
    } else {
      // No interviews or GUID, redirect to create interviews page
      navigate('/create-interviews');
    }
  }, [interviewGuid, navigate, setJobTitleString]);

  // Generate questions when interview is loaded
  useEffect(() => {
    if (currentInterview && !questionsGenerated) {
      generateQuestionsForInterview();
    }
  }, [currentInterview, questionsGenerated]);

  const generateQuestionsForInterview = async () => {
    try {
      // Get CV data from localStorage (stored during CV upload)
      const storedCvData = localStorage.getItem('cvData');
      let cvDetails = {};
      
      if (storedCvData) {
        cvDetails = JSON.parse(storedCvData);
      } else {
        // Fallback CV data if not found
        cvDetails = {
          "EXPERIENCE": "Software Developer with 3 years experience in React and Node.js",
          "EDUCATION": "Bachelor's in Computer Science",
          "SKILLS": "JavaScript, React, Node.js, MongoDB, AWS"
        };
      }

      // Now generate questions with both CV data AND custom questions
      const questionResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: currentInterview?.jobDescription,
          cvDetails: cvDetails,
          customQuestions: currentInterview?.customQuestions || [] // Include custom questions here
        }),
      });

      if (!questionResponse.ok) {
        throw new Error('Failed to generate questions');
      }

      const questions = await questionResponse.json();
      
      if (Array.isArray(questions)) {
        setQuestionsArray(questions);
        setQuestionsGenerated(true);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to default questions if generation fails
      const fallbackQuestions = [
        "Tell me about your experience with the technologies mentioned in this role.",
        "Describe a challenging project you've worked on and how you overcame the difficulties.",
        "Why are you interested in this particular position and our company?"
      ];
      
      // If there are custom questions, add them to the fallback
      if (currentInterview?.customQuestions && currentInterview.customQuestions.length > 0) {
        const combinedQuestions = [...currentInterview.customQuestions, ...fallbackQuestions];
        setQuestionsArray(combinedQuestions.slice(0, 3)); // Limit to 3 questions
      } else {
        setQuestionsArray(fallbackQuestions);
      }
      setQuestionsGenerated(true);
    }
  };

  // Text-to-Speech function
  const textToSpeech = async (text: string) => {
    const apiKey = "sk_e22858d9fb425d71974efdc861de1ac41f818187f270ac20";
    const voiceId = "UgBBYS2sOqTuMpoF3BR0";

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          }),
        }
      );
      if (!response.ok) throw new Error(`Failed to synthesize speech: ${response.statusText}`);
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error during text-to-speech:", error);
    }
  };

  // Welcome speech effect
  useEffect(() => {
    if (!welcomeSpeechPlayed && currentInterview) {
      const candidateName = interviewerName || "Candidate";
      textToSpeech(`Hi ${candidateName}, Welcome to the ${currentInterview.jobTitle} interview. I'll be conducting this AI-powered interview today. When you're ready to begin, please click the Start Interview button. Good luck!`);
      setWelcomeSpeechPlayed(true);
    }
  }, [welcomeSpeechPlayed, currentInterview, interviewerName]);

  const handleStartInterview = () => {
    if (questions.length === 0) {
      alert("Questions are still being generated. Please wait a moment.");
      return;
    }
    setIsInterviewStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsInterviewStarted(false);
      setShowSummary(true);
    }
  };

  const handleFinishInterview = () => {
    setIsInterviewStarted(false);
    setShowSummary(true);
  };

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

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToInterviews}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Interviews
            </Button>
          </div>

          <div className="text-center items-center mb-8">
            <img width={180} height={75} src={SmartHireLogo} className="inline-block mx-auto" alt="SmartHire Logo" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{currentInterview.jobTitle}</h1>
            <p className="text-gray-600">AI-Powered Interview Session</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoFeed isEnabled={isVideoEnabled} />
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={isVideoEnabled ? "default" : "outline"}
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className="flex items-center gap-2"
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    {isVideoEnabled ? 'Camera On' : 'Camera Off'}
                  </Button>
                  <Button
                    variant={isMicEnabled ? "default" : "outline"}
                    onClick={() => setIsMicEnabled(!isMicEnabled)}
                    className="flex items-center gap-2"
                  >
                    {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    {isMicEnabled ? 'Mic On' : 'Mic Off'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Interview Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Job Title</h3>
                  <p className="text-gray-700">{currentInterview.jobTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Questions Ready</h3>
                  <p className="text-gray-700">{questionsGenerated ? `${questions.length} questions generated` : 'Generating questions...'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interview Guidelines</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Speak clearly and at a normal pace</li>
                    <li>• Take your time to think before answering</li>
                    <li>• The AI will indicate when it's ready for your response</li>
                    <li>• You can proceed to the next question when ready</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleStartInterview}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!isMicEnabled || !isVideoEnabled || !questionsGenerated}
            >
              Start Interview
            </Button>
            {(!isMicEnabled || !isVideoEnabled) && (
              <p className="text-sm text-red-600 mt-2">
                Please enable both camera and microphone to start the interview.
              </p>
            )}
            {!questionsGenerated && (
              <p className="text-sm text-blue-600 mt-2">
                Generating personalized questions for this role...
              </p>
            )}
          </div>
        </div>

        <SummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          evaluationAnsweredArray={evaluationAnsweredArray}
          setEvaluationAnsweredArray={setEvaluationAnsweredArray}
          isEvaluating={isEvaluating}
          setEvaluating={setEvaluating}
          interviwerName={interviewerName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentInterview.jobTitle} - AI Interview</h1>
              <p className="text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {isListening ? 'Listening...' : isEvaluating ? 'Evaluating' : 'Speaking'}
              </Badge>
              <Button variant="outline" onClick={handleFinishInterview}>
                End Interview
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Your Video</CardTitle>
              </CardHeader>
              <CardContent>
                <VideoFeed isEnabled={isVideoEnabled} />
              </CardContent>
            </Card>
          </div>

          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg">Current Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <InterviewControls
                    currentQuestionText={currentQuestionText}
                    setIsListening={setIsListening}
                    questionNumber={currentQuestion - 1}
                    isListening={isListening}
                    answeredArray={answeredArray}
                    setAnsweredArray={setAnsweredArray}
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    onNextQuestion={handleNextQuestion}
                    onFinishInterview={handleFinishInterview}
                    evaluationAnsweredArray={evaluationAnsweredArray}
                    setEvaluationAnsweredArray={setEvaluationAnsweredArray}
                    isEvaluating={isEvaluating}
                    setEvaluating={setEvaluating}
                    jobTitle={currentInterview.jobTitle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        evaluationAnsweredArray={evaluationAnsweredArray}
        setEvaluationAnsweredArray={setEvaluationAnsweredArray}
        isEvaluating={isEvaluating}
        setEvaluating={setEvaluating}
        interviwerName={interviewerName}
      />
    </div>
  );
};

export default DynamicInterview;