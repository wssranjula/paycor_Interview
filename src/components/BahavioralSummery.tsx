
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Container
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Home as HomeIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  AccessTime as ClockIcon,
  CheckCircle
} from '@mui/icons-material';
import { CardHeader, CardTitle } from '@/components/ui/card';

const BehavioralAssessment = () => {
  const navigate = useNavigate();

   const summaryData = {
    strengths: [
      'Professional demeanor',
      'Good Voice Clarity',
    ],
    areasForImprovement: [
      'Improve conciseness and precision in communication',
      'Further enhance Grammar & Syntax',
      'Increase Confidence Level'
    ],
  };

  // Mock data for demonstration
  const overallData = {
    communicationScore: 78,
    totalQuestions: 5,
    averageResponseTime: '32 seconds',
    totalSpeakingTime: '12 minutes',
    candidateName: 'John Doe',
    interviewDate: '2024-01-15',
    behavioralMetrics: [
      { type: 'clarity', score: 85, label: 'Voice Clarity' },
      { type: 'grammar', score: 72, label: 'Grammar & Syntax' },
      { type: 'fluency', score: 80, label: 'Speech Fluency' },
      { type: 'confidence', score: 75, label: 'Confidence Level' }
    ]
  };

  const questions = [
    {
      id: 1,
      question: "Can you explain the concept of Virtual DOM in React and why it's so beneficial for performance?",
      communicationScore: 82,
      metrics: {
        clarity: 85,
        grammar: 78,
        fluency: 85,
        confidence: 80,
        responseTime: '45 seconds',
        pauseCount: 3,
        fillerWords: 2
      }
    },
    {
      id: 2,
      question: "What are the key differences between state and props in React, and when would you use each?",
      communicationScore: 75,
      metrics: {
        clarity: 80,
        grammar: 70,
        fluency: 75,
        confidence: 75,
        responseTime: '62 seconds',
        pauseCount: 5,
        fillerWords: 4
      }
    },
    {
      id: 3,
      question: "How does data typically flow through a React application, and why is this unidirectional approach preferred?",
      communicationScore: 88,
      metrics: {
        clarity: 90,
        grammar: 85,
        fluency: 90,
        confidence: 88,
        responseTime: '38 seconds',
        pauseCount: 2,
        fillerWords: 1
      }
    }
  ];

  const communicationTimeline = [
    { time: '00:02:15', event: 'Strong opening statement', type: 'positive' },
    { time: '00:05:30', event: 'Excessive filler words detected', type: 'concern' },
    { time: '00:08:45', event: 'Clear and structured response', type: 'positive' },
    { time: '00:12:20', event: 'Long pause - possible hesitation', type: 'concern' },
    { time: '00:15:10', event: 'Improved grammar and fluency', type: 'positive' },
    { time: '00:18:30', event: 'Confident closing response', type: 'positive' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getTimelineColor = (type: string) => {
    return type === 'positive' ? 'success' : 'warning';
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'clarity': return <VolumeUpIcon />;
      case 'grammar': return <SchoolIcon />;
      case 'fluency': return <SpeedIcon />;
      case 'confidence': return <PsychologyIcon />;
      default: return <MicIcon />;
    }
  };

  return (
    <Container maxWidth="lg" >
      {/* Overall Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {overallData.communicationScore >= 80 ? <CheckCircleIcon color="success" /> : 
             overallData.communicationScore >= 60 ? <WarningIcon color="warning" /> : 
             <ErrorIcon color="error" />}
            Overall Communication Assessment
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Communication Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={overallData.communicationScore} 
                      color={getScoreColor(overallData.communicationScore)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {overallData.communicationScore}%
                  </Typography>
                </Box>
                <Chip 
                  label={getScoreLabel(overallData.communicationScore)} 
                  color={getScoreColor(overallData.communicationScore)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Communication Metrics
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {overallData.behavioralMetrics.map((metric, index) => (
              <Card variant="outlined" key={index}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getMetricIcon(metric.type)}
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {metric.score}%
                  </Typography>
                  <Chip 
                    label={getScoreLabel(metric.score)} 
                    color={getScoreColor(metric.score)}
                    size="small"
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

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

      {/* Question Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Question-wise Communication Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Detailed breakdown of communication skills for each interview question
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {questions.map((question) => (
              <Card key={question.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Question {question.id}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {question.question}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${question.communicationScore}%`} 
                      color={getScoreColor(question.communicationScore)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Communication Score
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={question.communicationScore} 
                      color={getScoreColor(question.communicationScore)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Voice Clarity
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {question.metrics.clarity}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Grammar
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {question.metrics.grammar}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fluency
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {question.metrics.fluency}%
                      </Typography>
                    </Box>
                    
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${question.metrics.pauseCount} pauses`}
                      color="info"
                      size="small"
                    />
                    <Chip
                      label={`${question.metrics.fillerWords} filler words`}
                      color={question.metrics.fillerWords > 3 ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BehavioralAssessment;