import React, { useContext } from 'react';
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
  Visibility as EyeIcon,
  VolumeUp as VolumeUpIcon,
  Mouse as MouseIcon,
  AccessTime as ClockIcon
} from '@mui/icons-material';
import InterviewQuestionContext, { InterviewQuestionContextType } from '@/contexts/InterviewQuestionContext';

const PlagiarismSummary = () => {
  const navigate = useNavigate();

   const { questions : generatedQuestions }: InterviewQuestionContextType = useContext(InterviewQuestionContext);
  

  // Mock data for demonstration
  const overallData = {
    riskScore: 65,
    totalQuestions: 3,
    questionsWithViolations: 3,
    totalViolations: 12,
    interviewDuration: '45 minutes',
    candidateName: 'John Doe',
    interviewDate: '2024-01-15',
    cheatingEvents: [
      { type: 'gaze', count: 6, severity: 'high' },
      { type: 'audio', count: 2, severity: 'medium' },
      { type: 'movement', count: 2, severity: 'low' }
    ]
  };

  const questions = [
    {
      id: 1,
      question: generatedQuestions?.length >0 ?generatedQuestions[0]:"",
      riskScore: 45,
      cheatingEvents: [
        { type: 'gaze', count: 1, severity: 'low' },
        { type: 'audio', count: 1, severity: 'low' }
      ]
    },
    {
      id: 2,
      question: generatedQuestions?.length >0 ?generatedQuestions[1]:"",
      riskScore: 60,
      cheatingEvents: [
        { type: 'gaze', count: 2, severity: 'medium' },
        { type: 'movement', count: 1, severity: 'low' },
         { type: 'audio', count: 1, severity: 'low' }
      ]
    },
    {
      id: 3,
      question: generatedQuestions?.length >0 ?generatedQuestions[2]:"",
      riskScore: 80,
      cheatingEvents: [
        { type: 'gaze', count: 3, severity: 'high' },
        { type: 'movement', count: 1, severity: 'low' }
      ]
    }
  ];

  const timelineEvents = [
    { time: '00:05:30', event: 'Looking away from screen', severity: 'high' },
    { time: '00:12:15', event: 'Suspicious audio detected', severity: 'medium' },
    { time: '00:18:45', event: 'Multiple gaze violations', severity: 'high' },
    { time: '00:25:10', event: 'Unusual movement pattern', severity: 'low' },
    { time: '00:32:20', event: 'Looking away from screen', severity: 'high' },
    { time: '00:38:55', event: 'Audio anomaly detected', severity: 'medium' }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'error';
    if (score >= 60) return 'warning';
    return 'success';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'High Risk';
    if (score >= 60) return 'Medium Risk';
    return 'Low Risk';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'gaze': return <EyeIcon />;
      case 'audio': return <VolumeUpIcon />;
      case 'movement': return <MouseIcon />;
      default: return <WarningIcon />;
    }
  };

  return (
    <Container maxWidth="lg" >
      {/* Overall Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {overallData.riskScore >= 80 ? <ErrorIcon color="error" /> : 
             overallData.riskScore >= 60 ? <WarningIcon color="warning" /> : 
             <CheckCircleIcon color="success" />}
            Overall Assessment
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Box sx={{ flex: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Risk Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={overallData.riskScore} 
                      color={getRiskColor(overallData.riskScore)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {overallData.riskScore}%
                  </Typography>
                </Box>
                <Chip 
                  label={getRiskLabel(overallData.riskScore)} 
                  color={getRiskColor(overallData.riskScore)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            {/* <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Violations
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {overallData.totalViolations}
                  </Typography>
                </Box>
              </Box>
            </Box> */}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Violation Breakdown
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {overallData.cheatingEvents.map((event, index) => (
              <Card variant="outlined" key={index}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getSeverityIcon(event.type)}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}>
                      {event.type} Detection
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {event.count}
                  </Typography>
                  <Chip 
                    label={event.severity} 
                    color={getSeverityColor(event.severity)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Question-wise Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Detailed breakdown of cheating detection for each interview question
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
                      label={`${question.riskScore}%`} 
                      color={getRiskColor(question.riskScore)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Level
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={question.riskScore} 
                      color={getRiskColor(question.riskScore)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {question.cheatingEvents.length > 0 ? (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                        Detected Violations:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {question.cheatingEvents.map((event, index) => (
                          <Chip
                            key={index}
                            icon={getSeverityIcon(event.type)}
                            label={`${event.type}: ${event.count}`}
                            color={getSeverityColor(event.severity)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      No violations detected for this question
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      
    </Container>
  );
};

export default PlagiarismSummary;