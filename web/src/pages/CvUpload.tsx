import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PaycorLogo from "../assets/PaycorLogo.png"
import InterviewQuestionContext , { InterviewQuestionContextType } from '../contexts/InterviewQuestionContext';
import JobTitleContext, {JobTitleContextType} from "@/contexts/JobTitleContext";
import InterviewerNameContext, {InterviewerNameContextType} from "@/contexts/InterviewerNameContext";

interface CvUploadProps {
  jobRole: string;
  jobDescription: string;
  customQuestions?: string[];
  interviewId?: string;
}

const CvUpload: React.FC<CvUploadProps> = ({
  jobRole,
  jobDescription,
  customQuestions = [],
  interviewId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [structuredData, setStructuredData] = useState<Record<string, string>>({});

  const { setQuestionsArray }: InterviewQuestionContextType = useContext(InterviewQuestionContext);
  const {setJobTitleString}: JobTitleContextType = useContext(JobTitleContext);
  const {setInterviewerNameString}: InterviewerNameContextType = useContext(InterviewerNameContext);
  const navigate = useNavigate();

  useEffect(() => {
    setJobTitleString(jobRole);
  }, [jobRole, setJobTitleString]);

  const endpoint = "https://paycor-cv.cognitiveservices.azure.com";
  const apiKey = "bfa851e3d4d34a9285ec9592878232aa";
  const modelId = "prebuilt-layout";
  const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(true);
    }
  };

  const parseCvText = (text: string): Record<string, string> => {
    const sections: Record<string, string[]> = {};
    const requiredSections = [
      "EXPERIENCE",
      "EDUCATION",
      "SKILLS & INTERESTS",
      "SKILLS",
      "PROJECT EXPERIENCE",
      "WORK EXPEREINCE",
      "CERTIFICATIONS",
      "PROJECTS",
      "SUMMARY",
    ];

    const ignoreSections = ["REFERENCES", "CONTACT", "PAGE", "ADDRESS"];
    let currentSection: string | null = null;

    const lines = text.split("\n");
    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return;

      if (/^[A-Z\s&]+$/.test(trimmedLine) && !/\d/.test(trimmedLine)) {
        if (requiredSections.includes(trimmedLine)) {
          currentSection = trimmedLine;
          sections[currentSection] = [];
        } else if (!ignoreSections.includes(trimmedLine)) {
          currentSection = trimmedLine;
          sections[currentSection] = [];
        } else {
          currentSection = null;
        }
      } else if (currentSection) {
        sections[currentSection].push(trimmedLine);
      }
    });

    const finalSections: Record<string, string> = {};
    Object.keys(sections).forEach((key) => {
      finalSections[key] = sections[key].join("\n");
    });

    return finalSections;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    setLoading(true);
    setStructuredData({});

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response || !response.headers) {
        throw new Error("Invalid response from Azure API");
      }

      const operationLocation = response.headers["operation-location"];
      if (!operationLocation) throw new Error("No operation location found.");

      let result = null;
      while (!result) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const pollResponse = await axios.get(operationLocation, {
          headers: { "Ocp-Apim-Subscription-Key": apiKey },
        });

        if (pollResponse.data.status === "succeeded") {
          result = pollResponse.data.analyzeResult;
        }
      }

      const extractedText: string = result.content || "No text extracted.";
      const structuredOutput = parseCvText(extractedText);
      setStructuredData(structuredOutput);

      // Store CV data in localStorage for later use in the interview
      localStorage.setItem('cvData', JSON.stringify(structuredOutput));

      console.log("Extracted CV data:", structuredOutput);

      // Generate basic questions for validation (without custom questions)
      // The actual interview questions with custom questions will be generated later
      const questionResponse = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/generate-questions`,
        {
          jobDescription,
          cvDetails: structuredOutput
        });

      // Extract candidate name
      const name = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/extract-name`, {
        text: extractedText
      });  

      console.log("Generated basic questions for validation:", questionResponse.data);
      console.log("Extracted name:", name?.data?.name);

      setInterviewerNameString(name?.data?.name || "Candidate");
      
      // Store basic questions for validation (actual interview questions will be generated later with custom questions)
      if (Array.isArray(questionResponse.data) && questionResponse.data.every((item: any) => typeof item === 'string')) {
        setQuestionsArray(questionResponse.data as string[]);
      } else {
        console.error("API response for questions is not a string array:", questionResponse.data);
        alert("Received unexpected question format from API.");
        return;
      }

      setShowPopup(true);

    } catch (error) {
      console.error("Error during extraction and generation:", error);
      alert("Error during extraction and generation. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextClick = () => {
    setShowPopup(false);
    
    if (interviewId) {
      // Navigate to dynamic interview page
      const urlSlug = jobRole.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/interview/${urlSlug}`);
    } else {
      // Fallback to original interview page
      navigate("/interview");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        backgroundColor: "white",
      }}
    >
      <img width={120} height={50} src={PaycorLogo} alt="Paycor Logo" />
      <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "black" }}>
        {jobRole}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "16px",
          boxShadow: 3,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 4,
            background: "#f4791f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 4,
              border: "1px solid #e1e9ee",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ color: "#5a5a5a", whiteSpace: "pre-wrap" }}>
              {jobDescription}
            </Typography>
            
            {/* {customQuestions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Custom Interview Questions
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: "#5a5a5a" }}>
                  {customQuestions.map((question, index) => (
                    <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                      {question}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )} */}
          </Paper>
          
          <Typography variant="h6" color="white" fontWeight="bold" mb={2}>
            Submit Your CV
          </Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              borderColor: "white",
              color: "white",
              mb: 1,
              alignSelf: "flex-start",
              minWidth: "100px",
              padding: "2px 12px",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#e8f4fc", color: "#17022b" },
            }}
          >
            Upload CV
            <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
          </Button>
          {uploadSuccess && (
            <Typography variant="body2" mt={1} sx={{ color: "green" }}>
              CV uploaded successfully!
            </Typography>
          )}
          <Typography variant="body2" mt={1} sx={{ color: "white" }}>
            Supported format: PDF
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            sx={{
              mt: 1,
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "white",
              color: "#17022b",
              alignSelf: "flex-start",
              minWidth: "100px",
              padding: "2px 12px",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#004182", color: "white" },
            }}
            disabled={!file || loading}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </Box>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Success Dialog */}
      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#0a66c2" }}>
          CV Submitted Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ mb: 2 }}>
            Your CV has been processed and personalized questions have been generated.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Click "Start Interview" to begin your AI-powered interview session.
          </Typography>
          {customQuestions.length > 0 && (
            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
              This interview includes {customQuestions.length} custom question{customQuestions.length !== 1 ? 's' : ''} along with AI-generated questions.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleNextClick}
            size="small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#28a745",
              "&:hover": { backgroundColor: "#218838" },
            }}
          >
            Start Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CvUpload;