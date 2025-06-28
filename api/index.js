// index.js
const express = require('express');
const axios = require('axios');
const interviewRoutes = require('./routes/interviewRoutes'); // Import the new routes
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins during development.
// For production, you might want to configure this to allow specific origins only:
app.use(cors({ origin: 'http://localhost:8080' })); // Example for specific origin
// app.use(cors()); 

// Use the interview routes for the '/api' path
app.use('/api', interviewRoutes);

// Basic route for testing (optional)
app.get('/', (req, res) => {
    res.send('Interview Question Generator API is running. Access /api/generate-questions to use.');
});

app.get("/api/get-speech-token", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const speechKey = process.env.SPEECH_KEY || 'G1WMV6EPUEjIjAy0ANPaQhzBFHzYUOO7c83eMdK1FyiQaaVSh6gOJQQJ99BFACGhslBXJ3w3AAAYACOGNbHI';
  const speechRegion = process.env.SPEECH_REGION || 'centralindia';

  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": speechKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.post(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      headers
    );
    res.send({ token: tokenResponse.data, region: speechRegion });
  } catch (err) {
    console.log("error...",err)
    res.status(401).send("There was an error authorizing your speech key.");
  }
});


// Start the server
app.listen(port, () => {
    console.log(`Interview question generator server listening on port ${port}`);
    console.log(`Access the endpoint at: http://localhost:${port}/api/generate-questions`);
});
