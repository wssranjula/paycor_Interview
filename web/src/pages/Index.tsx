import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import VideoFeed from '@/components/VideoFeed';
import InterviewControls from '@/components/InterviewControls';
import SummaryModal from '@/components/SummaryModal';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import SmartHireLogo from "../assets/SmartHireLogo.png"

import InterviewQuestionContext, { InterviewQuestionContextType } from '../contexts/InterviewQuestionContext';
import JobTitleContext, {JobTitleContextType} from '@/contexts/JobTitleContext';

const Index: React.FC = () => { // Explicitly type Index as a functional component
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [welcomeSpeechPlayed, setWelcomeSpeechPlayed] = useState(false); // New state to track welcome speech
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

  const { questions }: InterviewQuestionContextType = useContext(InterviewQuestionContext);
  const { jobTitle }: JobTitleContextType = useContext(JobTitleContext);
  const totalQuestions = questions.length;

  const currentQuestionText = questions[currentQuestion - 1] || "Loading next question..."; // Handle undefined gracefully

  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  useEffect(()=>{
    console.log("answeredArray.....",answeredArray)
  },[answeredArray.length])

  useEffect(()=>{
    console.log("job title....", jobTitle)
  },[jobTitle])

  // Text-to-Speech function with proper typing
  const textToSpeech = async (text: string) => {
    const apiKey = "sk_e22858d9fb425d71974efdc861de1ac41f818187f270ac20"; // Replace with your ElevenLabs API key
    const voiceId = "UgBBYS2sOqTuMpoF3BR0"; // Replace with your chosen voice ID

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
      // Implement a more robust error handling/user feedback here
    }
  };

  // Effect for initial welcome speech, runs only once
  useEffect(() => {
    if (!welcomeSpeechPlayed) { // Check if it hasn't played yet
      textToSpeech("Hi Isuru, Welcome to Paycor SmartHire. You'll be interviewed by me. Whenever you're ready to dive into the interview, hit that Start button! Wishing you the very best of luck!");
      setWelcomeSpeechPlayed(true); // Mark as played
    }
  }, [welcomeSpeechPlayed]); // Dependency array: only re-run if welcomeSpeechPlayed changes (which it will, once)


  const handleStartInterview = () => {
    if (questions.length === 0) {
      alert("No questions loaded yet. Please upload CV first to generate questions.");
      return;
    }
    setIsInterviewStarted(true);
    // setIsListening(true); // This should probably happen after the first question is spoken by the AI via Banner component
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

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center items-center mb-8">
            <img width={180} height={75} src={SmartHireLogo} className="inline-block mx-auto" alt="SmartHire Logo" />
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
                <CardTitle>Interview Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <p className="text-sm text-gray-600">Speak clearly and at a normal pace</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <p className="text-sm text-gray-600">Take your time to think before answering</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <p className="text-sm text-gray-600">The AI will indicate when it's ready for your response</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <p className="text-sm text-gray-600">You can proceed to the next question when ready</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleStartInterview}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!isMicEnabled || !isVideoEnabled || questions.length === 0} // Disable if no questions
            >
              Start Interview
            </Button>
            {(!isMicEnabled || !isVideoEnabled) && (
              <p className="text-sm text-red-600 mt-2">
                Please enable both camera and microphone to start the interview.
              </p>
            )}
            {questions.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No interview questions loaded. Please go back to the CV upload page to generate questions.
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
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Session</h1>
              <p className="text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {isListening ? 'Listening...' : isEvaluating?'Evaluating' : 'Speaking'}
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
                <div >
                  {/* Ensure currentQuestionText is not undefined */}
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
                    jobTitle={jobTitle}
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
      />
    </div>
  );
};

export default Index;