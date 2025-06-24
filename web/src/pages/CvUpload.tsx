import { useState } from "react";
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

import PaycorLogo from "../assets/PaycorLogo.png"

const jobRole = "Intern Software Engineer";
const jobDescription = `
Job Description
About the Role:

 ABC is seeking a talented and passionate Frontend Developer with strong expertise in React to join our growing engineering team. You will play a key role in building and maintaining user-facing applications, contributing to the entire software development lifecycle. This is an exciting opportunity to work on challenging projects, collaborate with a skilled team, and make a significant impact on our products.

Responsibilities:

- Design, develop, and maintain high-performance and scalable frontend applications using React.
- Write clean, well-documented, and testable JavaScript or TypeScript code.
- Collaborate closely with UI/UX designers to translate mockups and prototypes into functional and visually appealing user interfaces.
- Integrate frontend applications with backend APIs and services.
- Participate in code reviews, providing constructive feedback and ensuring code quality.
- Troubleshoot and debug frontend issues, implementing effective solutions.
- Stay up-to-date with the latest frontend technologies, trends, and best practices.
- Contribute to the improvement of our development processes and tools.
- Mentor and guide junior frontend developers (if applicable).
- Participate in agile ceremonies, including sprint planning, daily stand-ups, and retrospectives.

Requirements:

- Bachelor's degree in Computer Science or a related field (or equivalent practical experience).
- Proven experience (X+ years, specify level e.g., 3+ years) as a Frontend Developer with a strong focus on React.
- Deep understanding of core React principles, including component lifecycle, state management (e.g., Redux, Context API, Zustand), hooks, and performance optimization.
- Solid proficiency in JavaScript (ES6+) or TypeScript.
- Experience with modern frontend build tools and workflows (e.g., Webpack, Babel, npm/yarn).
- Strong understanding of HTML5, CSS3, and responsive design principles.
- Experience with testing frameworks (e.g., Jest, React Testing Library, Cypress).
- Familiarity with RESTful APIs and asynchronous programming.
- Experience with version control systems (Git).
- Excellent problem-solving, communication, and collaboration skills.
- Ability to work independently and as part of a team in an Agile environment.

Bonus Points (Optional):

- Experience with server-side rendering (SSR) or static site generation (SSG) frameworks (e.g., Next.js, Gatsby).
- Familiarity with UI component libraries (e.g., Material UI, Ant Design).
- Experience with containerization technologies (e.g., Docker, Kubernetes).
- Knowledge of CI/CD pipelines.
- Contributions to open-source projects.
- Experience with performance monitoring and optimization tools.

What We Offer:

- Competitive salary and benefits package.
- Opportunity to work on challenging and impactful projects.
- A collaborative and supportive work environment.
- Opportunities for professional growth and development.
- [Add any other specific benefits your company offers]
`;

const CvUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
    }, 1000); // Simulate upload
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
      <img width={120} height={50}  src={PaycorLogo}/>
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
        {/* Right Section: Placeholder for image or illustration */}
        {/* <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
        </Box> */}
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
            href="/interview"
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