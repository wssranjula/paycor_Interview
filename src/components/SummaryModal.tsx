
import React,{useEffect,useState} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MessageSquare, FileText } from 'lucide-react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import SchoolIcon from '@mui/icons-material/School';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PlagiarismSummery from './PlagiarismSummery';
import BahavioralSummery from './BahavioralSummery';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  // Mock data for the interview summary
  const summaryData = {
    duration: '3 minutes',
    questionsAnswered: 3,
    overallRating: 'Good',
    strengths: [
      'Ability to articulate technical concepts',
      'Solid grasp of core React concepts',
      'Professional demeanor'
    ],
    areasForImprovement: [
      'Expand on breadth of technical skills',
      'Could provide more specific examples'
    ],
    responses: [
      {
        question: "Can you explain the concept of Virtual DOM in React and why it's so beneficial for performance?",
        summary: "Provided a very clear and accurate definition of the Virtual DOM, including the 'diffing' process and its direct impact on performance. Demonstrated a strong foundational understanding.",
        rating: "Excellent"
      },
      {
        question: "What are the key differences between state and props in React, and when would you use each?",
        summary: "Clearly articulated the differences between state and props, including mutability and data flow direction. The 'Counter' example was concise and effectively illustrated a practical application for both.",
        rating: "Good"
      },
      {
        question: "How does data typically flow through a React application, and why is this unidirectional approach preferred?",
        summary: "Described unidirectional flow accurately, including the parent-to-child data transfer and child-to-parent communication via callbacks. The benefits of predictability were mentioned. Could have elaborated slightly more on how callbacks facilitate upstream communication.",
        rating: "Average"
      }
    ]
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //  useEffect(() => {
  //   if(isOpen){
  //     textToSpeech("Thanks for your time today, Anjuka. Here's a summary of our interview, which I'll be sharing with the Paycor team. They'll reach out to you directly if you're shortlisted");
  //   }
  //   }, [isOpen]);
  
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
    audio.play();
  };

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Developing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-blue-600" />
            Interview Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold">{summaryData.duration}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Questions Answered</p>
                <p className="text-lg font-semibold">{summaryData.questionsAnswered}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Overall Rating</p>
                <Badge className={getRatingColor(summaryData.overallRating)}>
                  {summaryData.overallRating}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
              <Tab icon={<SchoolIcon />} label="Skill Assessment" />
              <Tab icon={<FaceRetouchingNaturalIcon />} label="Communication Assessment" />
              <Tab icon={<PlagiarismIcon />} label="Plagiarism" />
            </Tabs>
          </div>

          {/* Strengths and Areas for Improvement */}
         {value ==0 && <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summaryData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-700">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summaryData.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-4 w-4 border-2 border-orange-400 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Response Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryData.responses.map((response, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-medium text-gray-900">Q{index + 1}: {response.question}</h4>
                    <Badge className={getRatingColor(response.rating)}>
                      {response.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{response.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          </div>}

          {value ==1 && <div><BahavioralSummery/></div>}

          {value ==2 && <div><PlagiarismSummery/></div>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryModal;
