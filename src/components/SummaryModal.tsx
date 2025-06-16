
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MessageSquare, FileText } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  // Mock data for the interview summary
  const summaryData = {
    duration: '18 minutes',
    questionsAnswered: 5,
    overallRating: 'Good',
    strengths: [
      'Clear communication skills',
      'Relevant experience mentioned',
      'Professional demeanor'
    ],
    areasForImprovement: [
      'Could provide more specific examples',
      'Expand on technical skills'
    ],
    responses: [
      {
        question: 'Tell me about yourself and your background.',
        summary: 'Candidate provided a clear overview of their professional journey with relevant experience in the field.',
        rating: 'Good'
      },
      {
        question: 'What interests you most about this position?',
        summary: 'Showed genuine interest in the role and company, mentioned specific aspects that appeal to them.',
        rating: 'Excellent'
      },
      {
        question: 'Describe a challenging project you\'ve worked on.',
        summary: 'Provided a concrete example with clear problem-solving approach and measurable outcomes.',
        rating: 'Good'
      }
    ]
  };

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

          {/* Strengths and Areas for Improvement */}
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
