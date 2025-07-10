import React, {useEffect, useState,useRef, useCallback} from 'react'
import { getTokenOrRefresh } from "../service/speechToken";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import axios from 'axios';

interface InterviewControlsProps {
  currentQuestionText: string;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  questionNumber:number;
  currentQuestion: number;
  totalQuestions: number;
  answeredArray: any[];
  setAnsweredArray: React.Dispatch<React.SetStateAction<any[]>>;
  evaluationAnsweredArray: any;
  setEvaluationAnsweredArray: React.Dispatch<React.SetStateAction<any>>;
  onNextQuestion: () => void;
  onFinishInterview: () => void;
  isEvaluating: boolean;
  setEvaluating: (listening: boolean) => void;
  jobTitle: string
}

const InterviewControls: React.FC<InterviewControlsProps> = ({
    currentQuestionText,
    setIsListening,
    isListening,
    questionNumber,
    answeredArray,
    setAnsweredArray,
    currentQuestion,
    totalQuestions,
    onFinishInterview,
    onNextQuestion,
    evaluationAnsweredArray,
    setEvaluationAnsweredArray,
    isEvaluating,
    setEvaluating, 
    jobTitle
}) => {

const conversationalQuestions = [
  "Alright, let's kick things off. " ,
  "Building on that ",
  "let's move to the last question"
      ];

    const isLastQuestion = currentQuestion >= totalQuestions;

    const [transcript, setTranscript] = useState("");
    const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
    const fullTranscriptRef = useRef("");

    useEffect(()=>{
        console.log("answeredArray.....",answeredArray)
      },[answeredArray.length])

    useEffect(()=>{
    console.log("this is current question..",currentQuestionText)
    textToSpeech(conversationalQuestions[questionNumber]+ currentQuestionText)
    },[currentQuestionText])

    useEffect(()=>{
      console.log("transcript",transcript)
    },[transcript])

const textToSpeech = async (text: string) => {
  const apiKey = "sk_b86d697eac985e1c1fc14527d7c7e02f89944b4414dbd1f1"; // <-- Replace with your ElevenLabs API key
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

    audio.addEventListener('ended', () => {
      console.log("Audio playback ended.");
      startListening();
      URL.revokeObjectURL(audioUrl);
    });

  audio.play();
};

    // useEffect for initializing the recognizer only once
  useEffect(() => {
        let recognizer: sdk.SpeechRecognizer;

        const initializeRecognizer = async () => {
            try {
                const tokenObj = await getTokenOrRefresh();
                const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
                    tokenObj.authToken,
                    tokenObj.region
                );
                speechConfig.speechRecognitionLanguage = "en-US";

                const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
                recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
                recognizerRef.current = recognizer;

                // Event handlers for the recognizer
                recognizer.recognized = (s, event) => {
                    if (event.result.reason === sdk.ResultReason.RecognizedSpeech) {
                        fullTranscriptRef.current += event.result.text + " ";
                        setTranscript(fullTranscriptRef.current.trim());
                    }
                };

                recognizer.recognizing = (s, event) => {
                    if (event.result.reason === sdk.ResultReason.RecognizingSpeech) {
                        console.log(`RECOGNIZING: Text=${event.result.text}`);
                    }
                };


                recognizer.canceled = (s, event) => {
                    console.log(`CANCELED: Reason=${event.reason}`);
                    if (event.reason === sdk.CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${event.errorCode}`);
                        console.log(`CANCELED: ErrorDetails=${event.errorDetails}`);
                    }

                };

                recognizer.sessionStopped = (s, event) => {
                    console.log(`Session stopped event`);

                };

                console.log("Speech recognizer initialized.");

            } catch (error) {
                console.error("Error initializing speech recognizer:", error);
            }
        };

        initializeRecognizer();

        // Cleanup function: Close the recognizer when the component unmounts
        return () => {
            if (recognizerRef.current) {
                console.log("Cleaning up recognizer on component unmount.");
                recognizerRef.current.stopContinuousRecognitionAsync(
                    () => {
                        recognizerRef.current?.close();
                        recognizerRef.current = null;
                        console.log("Recognizer closed during unmount.");
                    },
                    (err) => {
                        console.error("Error stopping recognizer during unmount:", err);
                        // Even if stop fails, try to close to release resources
                        recognizerRef.current?.close();
                        recognizerRef.current = null;
                    }
                );
            }
        };
    }, []); // Empty dependency array means this runs only once on mount and cleanup on unmount


      // --- START LISTENING FUNCTION ---
    const startListening = () => {
        if (recognizerRef.current) {
            setTranscript(""); // Clear previous transcript
            fullTranscriptRef.current = ""; // Reset ref too

            recognizerRef.current.startContinuousRecognitionAsync(
                () => {
                    setIsListening(true)
                    console.log("Continuous recognition started.");
                },
                (err) => {
                    console.error("Error starting speech recognition:", err);
                    setIsListening(false);
                }
            );
        } else {
            console.warn("Recognizer not initialized yet. Please wait.");
        }
    }

    // --- STOP LISTENING FUNCTION ---
    // Make this function update answeredArray directly with the *current* transcript
    const stopListening = useCallback(async () => {
        if (recognizerRef.current && isListening) {
            console.log("Attempting to stop continuous recognition...");

            // Capture the current transcript *before* stopping recognition if needed
            // However, the `recognized` event handler already updates `transcript` state,
            // so using the state directly here is fine.

            await recognizerRef.current.stopContinuousRecognitionAsync();
            console.log("Continuous recognition stopped.");
            setIsListening(false);

            // Now, add the last answer to the array.
            // Ensure `transcript` is the up-to-date value for the *just completed* question.
            setAnsweredArray(prevArray => [
                ...prevArray,
                {
                    question: currentQuestionText,
                    answer: fullTranscriptRef.current.trim() // Use the ref for the most complete transcript
                }
            ]);

        } else {
            console.log("Recognizer not active or already stopped.");
        }
    }, [isListening, currentQuestionText, setAnsweredArray]);


      const handleEvaluateAnswers = async () => {
        try {

          const finalAnswers = [...answeredArray]
          finalAnswers.push({
                    question: currentQuestionText,
                    answer: fullTranscriptRef.current.trim() // Use the ref for the most complete transcript
                })
            const apiUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/evaluate-answers`;
            // Use the most up-to-date answeredArray, which should now include the last question
            const response = await axios.post(apiUrl, {
              interviewData: finalAnswers,
              jobTitle: jobTitle
            });

            setEvaluationAnsweredArray(response.data);
            setEvaluating(false)
        } catch (err) {
            console.error('Error evaluating answers:', err);
        }
    };

  const handleNextClick = async () => {
    // Stop listening and add the current answer to answeredArray
    await stopListening();
    // Then proceed to the next question
    onNextQuestion();
  };

  const handleFinishClick = async () => {
    setEvaluating(true)
    // Stop listening and add the last answer to answeredArray
    await stopListening();
    // answeredArray should now be fully updated.
    await handleEvaluateAnswers();
    onFinishInterview();
  };


  return (
    <>
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <p className="text-lg text-gray-800 leading-relaxed">
        {currentQuestionText}
    </p>
    </div>

      <div className="bg-gray-50 p-4 rounded-lg mt-3">
        <p className="text-sm text-gray-600 mb-2">AI Agent Status:</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : isEvaluating?  'bg-blue-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium">
                {isListening ? 'Listening to your response...' : isEvaluating?'Evaluating the answers' :'Reading the question...'}
              </span>
          </div>
      </div>

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
    </>
  )
}

export default InterviewControls