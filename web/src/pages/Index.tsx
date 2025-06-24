
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import VideoFeed from '@/components/VideoFeed';
import InterviewControls from '@/components/InterviewControls';
import SummaryModal from '@/components/SummaryModal';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import Banner from '@/components/ui/banner';
import SmartHireLogo from "../assets/SmartHireLogo.png"

const Index = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(3);
  const [isListening, setIsListening] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const questions = [
  "Can you explain the concept of Virtual DOM in React and why it's so beneficial for performance?",
  "What are the key differences between state and props in React, and when would you use each?",
  "How does data typically flow through a React application, and why is this unidirectional approach preferred?"
];

  const currentQuestionText = questions[currentQuestion - 1];
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleStartInterview = () => {
    setIsInterviewStarted(true);
   // setIsListening(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setIsListening(false);
    } else {
      setIsInterviewStarted(false);
      setShowSummary(true);
    }
  };

  const handleFinishInterview = () => {
    setIsInterviewStarted(false);
    setShowSummary(true);
  };

   useEffect(() => {
      textToSpeech("Hi Anjuka, Welcome to Paycor SmartHire. You'll be interviewed by me. Whenever you're ready to dive into the interview, hit that Start button! Wishing you the very best of luck!");
  }, []);

  const textToSpeech = async (text) => {
  const apiKey = "sk_e22858d9fb425d71974efdc861de1ac41f818187f270ac20"; // <-- Replace with your ElevenLabs API key
  const voiceId = "UgBBYS2sOqTuMpoF3BR0"; // <-- Replace with your chosen voice ID

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
  if (!response.ok) throw new Error("Failed to synthesize speech");
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center items-center mb-8">
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hi Anjuka, Welcome to SmartHire.AI
            </h1> */}
            <img width={180} height={75} src={SmartHireLogo} className="inline-block mx-auto"/>
            {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You'll be interviewed by our advanced AI agent. Please ensure your microphone and camera are working properly. 
            </p> */}
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
              disabled={!isMicEnabled || !isVideoEnabled}
            >
              Start Interview
            </Button>
            {(!isMicEnabled || !isVideoEnabled) && (
              <p className="text-sm text-red-600 mt-2">
                Please enable both camera and microphone to start the interview
              </p>
            )}
          </div>
        </div>

        <SummaryModal 
          isOpen={showSummary} 
          onClose={() => setShowSummary(false)} 
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
                {isListening ? 'Listening...' : 'Speaking'}
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
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                 <Banner 
                 currentQuestionText={currentQuestionText}
                 setIsListening={setIsListening}
                 questionNumber={currentQuestion-1}
                 />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">AI Agent Status:</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium">
                      {isListening ? 'Listening to your response...' : 'Reading the question...'}
                    </span>
                  </div>
                </div>

                <InterviewControls
                  currentQuestion={currentQuestion}
                  totalQuestions={totalQuestions}
                  onNextQuestion={handleNextQuestion}
                  onFinishInterview={handleFinishInterview}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SummaryModal 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
      />
    </div>
  );
};

export default Index;
