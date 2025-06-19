import React, {useEffect} from 'react'

interface BannerProps {
  currentQuestionText: string;
  setIsListening: (listening: boolean) => void;
  questionNumber:number
}

const  banner: React.FC<BannerProps> = ({
    currentQuestionText,
    setIsListening,
    questionNumber
}) => {

const conversationalQuestions = [
  "Alright, let's kick things off with a fundamental" ,
  "That's a great explanation. Building on that",
  "Perfect. let's move to the last question"
     ];

    useEffect(()=>{
    console.log("this is current question..",currentQuestionText)
    // textToSpeech(conversationalQuestions[questionNumber]+ currentQuestionText)
    },[currentQuestionText])

const textToSpeech = async (text) => {
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
      setIsListening(true)
      URL.revokeObjectURL(audioUrl);
    });

  audio.play();
};


  return (
    <p className="text-lg text-gray-800 leading-relaxed">
        {currentQuestionText}
    </p>
  )
}

export default banner