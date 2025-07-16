import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Plus, 
  FileText, 
  Users, 
  Calendar, 
  Trash2,
  Edit3,
  Upload,
  X,
  Copy,
  Check
} from 'lucide-react';
import SmartHireLogo from "../assets/SmartHireLogo.png";

interface Interview {
  id: string;
  guid: string; // Add GUID for URL generation
  jobTitle: string;
  jobDescription: string;
  customQuestions: string[];
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
  candidatesCount: number;
}

const CreateInterviews: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [copiedGuid, setCopiedGuid] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    customQuestions: ['']
  });

  // Generate a GUID (UUID v4)
  const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  // Load interviews from localStorage on component mount
  useEffect(() => {
    const savedInterviews = localStorage.getItem('smartHireInterviews');
    if (savedInterviews) {
      const interviews = JSON.parse(savedInterviews);
      
      // Migration: Add GUIDs to existing interviews that don't have them
      const migratedInterviews = interviews.map((interview: any) => {
        if (!interview.guid) {
          return {
            ...interview,
            guid: generateGuid(),
            customQuestions: interview.customQuestions || [] // Ensure customQuestions exists
          };
        }
        return interview;
      });
      
      setInterviews(migratedInterviews);
      
      // Save migrated interviews back to localStorage if any migration occurred
      const needsMigration = interviews.some((interview: any) => !interview.guid);
      if (needsMigration) {
        localStorage.setItem('smartHireInterviews', JSON.stringify(migratedInterviews));
      }
    }
  }, []);

  // Save interviews to localStorage whenever interviews change
  useEffect(() => {
    localStorage.setItem('smartHireInterviews', JSON.stringify(interviews));
  }, [interviews]);

  const addCustomQuestion = () => {
    setFormData(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, '']
    }));
  };

  const removeCustomQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index)
    }));
  };

  const updateCustomQuestion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.map((q, i) => i === index ? value : q)
    }));
  };

  const handleCreateInterview = () => {
    if (!formData.jobTitle.trim() || !formData.jobDescription.trim()) {
      alert('Please fill in both job title and job description.');
      return;
    }

    // Filter out empty custom questions
    const validCustomQuestions = formData.customQuestions.filter(q => q.trim() !== '');

    const newInterview: Interview = {
      id: Date.now().toString(),
      guid: generateGuid(), // Generate GUID for URL
      jobTitle: formData.jobTitle.trim(),
      jobDescription: formData.jobDescription.trim(),
      customQuestions: validCustomQuestions,
      createdAt: new Date().toISOString(),
      status: 'active',
      candidatesCount: 0
    };

    if (isEditing) {
      // Update existing interview (keep the same GUID)
      setInterviews(prev => 
        prev.map(interview => 
          interview.id === isEditing 
            ? { 
                ...interview, 
                jobTitle: formData.jobTitle.trim(), 
                jobDescription: formData.jobDescription.trim(),
                customQuestions: validCustomQuestions
              }
            : interview
        )
      );
      setIsEditing(null);
    } else {
      // Create new interview
      setInterviews(prev => [newInterview, ...prev]);
    }

    // Reset form
    setFormData({ jobTitle: '', jobDescription: '', customQuestions: [''] });
    setIsCreateModalOpen(false);
  };

  const handleEditInterview = (interview: Interview) => {
    setFormData({
      jobTitle: interview.jobTitle,
      jobDescription: interview.jobDescription,
      customQuestions: interview.customQuestions.length > 0 ? interview.customQuestions : ['']
    });
    setIsEditing(interview.id);
    setIsCreateModalOpen(true);
  };

  const handleDeleteInterview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      setInterviews(prev => prev.filter(interview => interview.id !== id));
    }
  };

  const handleNavigateToCvUpload = (interview: Interview) => {
    // Store the selected interview data in localStorage for the CV upload page to use
    localStorage.setItem('currentInterview', JSON.stringify(interview));
    
    // Navigate to CV upload page with GUID
    navigate(`/cv-upload/${interview.guid}`);
  };

  const handleCopyUrl = async (interview: Interview) => {
    const url = `${window.location.origin}/cv-upload/${interview.guid}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedGuid(interview.guid);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedGuid(null);
      }, 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedGuid(interview.guid);
      setTimeout(() => {
        setCopiedGuid(null);
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img width={180} height={75} src={SmartHireLogo} className="inline-block mx-auto mb-4" alt="SmartHire Logo" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Management</h1>
          <p className="text-gray-600">Create and manage AI-powered interview sessions</p>
        </div>

        {/* Create Interview Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Interviews</h2>
            <p className="text-sm text-gray-600">{interviews.length} interview{interviews.length !== 1 ? 's' : ''} created</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Interview' : 'Create New Interview'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer, Data Scientist"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the complete job description here..."
                    className="min-h-[150px]"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Custom Questions (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomQuestion}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Question
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Add specific questions you want to ask. AI will generate additional questions based on the job description and CV.
                  </p>
                  
                  <div className="space-y-3">
                    {formData.customQuestions.map((question, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder={`Custom question ${index + 1}...`}
                            value={question}
                            onChange={(e) => updateCustomQuestion(index, e.target.value)}
                          />
                        </div>
                        {formData.customQuestions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCustomQuestion(index)}
                            className="px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditing(null);
                      setFormData({ jobTitle: '', jobDescription: '', customQuestions: [''] });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInterview}>
                    {isEditing ? 'Update Interview' : 'Create Interview'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Interviews Grid */}
        {interviews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews created yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first AI-powered interview</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {interview.jobTitle}
                      </CardTitle>
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditInterview(interview);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInterview(interview.id);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {interview.jobDescription.substring(0, 150)}...
                  </p>
                  
                  {interview.customQuestions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-blue-600 font-medium">
                        {interview.customQuestions.length} custom question{interview.customQuestions.length !== 1 ? 's' : ''} added
                      </p>
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{interview.candidatesCount} candidates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleNavigateToCvUpload(interview)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CV & Start
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(interview);
                      }}
                      className="px-3"
                      title="Copy interview URL"
                    >
                      {copiedGuid === interview.guid ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInterviews;