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
import { useNavigate } from "react-router-dom"; // Import useNavigate

import PaycorLogo from "../assets/PaycorLogo.png"
import InterviewQuestionContext , { InterviewQuestionContextType } from '../contexts/InterviewQuestionContext';
import JobTitleContext, {JobTitleContextType} from "@/contexts/JobTitleContext";

interface CvUploadProps {
  jobRole: string;
  jobDescription: string;
}


const CvUpload: React.FC<CvUploadProps> = ({
  jobRole,
  jobDescription
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [structuredData, setStructuredData] = useState<Record<string, string>>({}); // More specific type

  const { setQuestionsArray }: InterviewQuestionContextType = useContext(InterviewQuestionContext);
  const {setJobTitleString}: JobTitleContextType = useContext(JobTitleContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(()=>{
    setJobTitleString(jobRole);
  },[])

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

  const parseCvText = (text: string): Record<string, string> => { // Added type for text and return
    const sections: Record<string, string[]> = {}; // Use string[] for values initially
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
    let currentSection: string | null = null; // Type for currentSection

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

    const finalSections: Record<string, string> = {}; // Final type for joined sections
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

      const extractedText: string = result.content || "No text extracted."; // Type for extractedText
      const structuredOutput = parseCvText(extractedText);
      setStructuredData(structuredOutput);

      console.log("text....", structuredOutput);

      const questionResponse = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/generate-questions`,
        {
          jobDescription,
          cvDetails: structuredOutput,
        });

      console.log("questions from API.....", questionResponse.data);
      
      // Ensure the data is an array of strings before setting
      if (Array.isArray(questionResponse.data) && questionResponse.data.every((item: any) => typeof item === 'string')) {
        setQuestionsArray(questionResponse.data as string[]);
      } else {
        console.error("API response for questions is not a string array:", questionResponse.data);
        alert("Received unexpected question format from API.");
        return; // Stop if data format is incorrect
      }

      setShowPopup(true);

    } catch (error) {
      console.error("Error during extraction and generation:", error); // Log full error
      alert("Error during extraction and generation. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to interview page when "Next" is clicked
  const handleNextClick = () => {
    setShowPopup(false); // Close the dialog
    navigate("/interview"); // Navigate to the interview page
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
        {/* Removed commented-out Right Section */}
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
          <Typography sx={{ mb: 2 }}>Click "Next" to attend a quick interview.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleNextClick} // Changed from href to onClick
            size = "small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#28a745",
              "&:hover": { backgroundColor: "#218838" },
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CvUpload;