// routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController'); // Import the controller

// Define the route for generating questions
// POST /api/generate-questions
router.post('/generate-questions', interviewController.generateQuestions);

// Define the route for evaluating answers
// POST /api/evaluate-answers
router.post('/evaluate-answers', interviewController.evaluateAnswers); 

// Define the route for extract name
// POST /api/extract-name
router.post('/extract-name', interviewController.identifyCvAndExtractName); 

module.exports = router;