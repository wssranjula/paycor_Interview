// controllers/interviewController.js

// Replace with your actual API key for models other than gemini-2.0-flash or imagen-3.0-generate-002
// For gemini-2.0-flash, you can leave it as an empty string, and the Canvas environment will inject it.
const API_KEY = "AIzaSyAh_l6njwOBEsdYZfglccyGCnV6MZWyOoU"; 

/**
 * Generates interview questions based on job description and CV details using Gemini API.
 * Now supports custom questions that are mixed with AI-generated questions.
 * This function is designed to be an Express.js controller.
 * @param {object} req - The Express request object. Expects req.body to contain jobDescription, cvDetails, and optionally customQuestions.
 * @param {object} res - The Express response object.
 */
const generateQuestions = async (req, res) => {
    const { jobDescription, cvDetails, customQuestions = [] } = req.body;

    // Validate input
    if (!jobDescription || !cvDetails) {
        return res.status(400).json({ error: 'Both jobDescription and cvDetails are required.' });
    }

    try {
        let chatHistory = [];
        
        // Check if custom questions are provided
        const validCustomQuestions = Array.isArray(customQuestions) ? customQuestions.filter(q => q && q.trim() !== '') : [];
        
        if (validCustomQuestions.length > 0) {
            // This is for the interview stage - mix custom questions with AI-generated ones
            const totalQuestionsNeeded = 3;
            const aiQuestionsNeeded = Math.max(0, totalQuestionsNeeded - validCustomQuestions.length);
            
            let aiGeneratedQuestions = [];
            
            if (aiQuestionsNeeded > 0) {
                // Generate AI questions to complement custom questions
                const prompt = `
                    As an expert interviewer and AI assistant, your task is to generate a list of highly relevant, unique, and thought-probing interview questions.
                    These questions must be specifically tailored to a candidate's CV in the context of the requirements for this role.

                    Instructions:
                    1. Analyze the provided 'Job Description' and 'Candidate CV' thoroughly.
                    2. Generate EXACTLY ${aiQuestionsNeeded} questions that directly relate the candidate's experiences, skills, and projects (as described in their CV) to the needs and responsibilities outlined for this position.
                    3. Difficulty level of the questions should be based on the Role.
                    4. Prioritize questions that cannot be answered with a simple 'yes' or 'no' and encourage the candidate to elaborate on their experiences and problem-solving approaches.
                    5. **Ensure the questions are designed to flow logically, allowing for follow-up discussions. Think of them as a sequence of probing inquiries rather than isolated points.**
                    6. **Crucially, even if the job requirements and candidate profile are identical to previous requests, strive to generate a fresh set of questions each time.** Think about different angles, deeper dives into specific projects, or behavioral questions based on the CV details.
                    7. Ensure the questions are professional and fair, focusing on the job's demands rather than referencing the 'job description document' directly.
                    8. Note that the interviewer has already prepared ${validCustomQuestions.length} custom question(s), so focus on complementary areas that aren't covered by those custom questions.

                    Job Description:
                    ${jobDescription}

                    Candidate CV:
                    ${cvDetails}

                    Custom Questions Already Prepared:
                    ${validCustomQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
                    
                    Please generate EXACTLY ${aiQuestionsNeeded} additional questions that complement these custom questions.

                    Please provide EXACTLY ${aiQuestionsNeeded} questions as a JSON array of strings.
                `;

                chatHistory.push({ role: "user", parts: [{ text: prompt }] });

                const payload = {
                    contents: chatHistory,
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "STRING"
                            }
                        }
                    }
                };

                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const jsonString = result.candidates[0].content.parts[0].text;
                    aiGeneratedQuestions = JSON.parse(jsonString);
                } else {
                    // Fallback questions
                    const fallbackQuestions = [
                        "Tell me about your experience with the technologies mentioned in this role.",
                        "Describe a challenging project you've worked on and how you overcame the difficulties.",
                        "Why are you interested in this particular position and our company?"
                    ];
                    aiGeneratedQuestions = fallbackQuestions.slice(0, aiQuestionsNeeded);
                }
            }

            // Combine custom questions and AI-generated questions
            const allQuestions = [];
            const customQuestionsArray = [...validCustomQuestions];
            const aiQuestionsArray = [...aiGeneratedQuestions];
            
            // Simple strategy: alternate between custom and AI questions
            while (customQuestionsArray.length > 0 || aiQuestionsArray.length > 0) {
                if (customQuestionsArray.length > 0) {
                    allQuestions.push(customQuestionsArray.shift());
                }
                if (aiQuestionsArray.length > 0) {
                    allQuestions.push(aiQuestionsArray.shift());
                }
            }

            console.log(`Generated ${allQuestions.length} total questions (${validCustomQuestions.length} custom + ${aiGeneratedQuestions.length} AI-generated)`);
            res.json(allQuestions.slice(0, 3));

        } else {
            // This is for CV upload stage - generate standard questions without custom questions
            const prompt = `
                As an expert interviewer and AI assistant, your task is to generate a list of highly relevant, unique, and thought-provoking interview questions.
                These questions must be specifically tailored to a candidate's CV in the context of the requirements for this role.

                Instructions:
                1. Analyze the provided 'Job Description' and 'Candidate CV' thoroughly.
                2. Generate questions that directly relate the candidate's experiences, skills, and projects (as described in their CV) to the needs and responsibilities outlined for this position.
                3. Difficulty level of the questions should be based on the Role.
                4. Prioritize questions that cannot be answered with a simple 'yes' or 'no' and encourage the candidate to elaborate on their experiences and problem-solving approaches.
                5. **Ensure the questions are designed to flow logically, allowing for follow-up discussions. Think of them as a sequence of probing inquiries rather than isolated points.**
                6. **Crucially, even if the job requirements and candidate profile are identical to previous requests, strive to generate a fresh set of questions each time.** Think about different angles, deeper dives into specific projects, or behavioral questions based on the CV details.
                7. Ensure the questions are professional and fair, focusing on the job's demands rather than referencing the 'job description document' directly.
                8. Finally select 3 Random questions from them and ignore other ones.

                Job Description:
                ${jobDescription}

                Candidate CV:
                ${cvDetails}

                Please provide the questions as a JSON array of strings.
            `;

            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = {
                contents: chatHistory,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "STRING"
                        }
                    }
                }
            };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonString = result.candidates[0].content.parts[0].text;
                const interviewQuestions = JSON.parse(jsonString);
                res.json(interviewQuestions);
            } else {
                console.warn('Gemini API response structure unexpected:', result);
                res.status(500).json({ error: 'Failed to generate questions: Unexpected API response format.' });
            }
        }

    } catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

/**
 * Evaluates interview answers based on provided questions and answers using Gemini API,
 * provides individual question ratings, and an overall rating with strengths and areas for improvement.
 * The depth of analysis is tailored based on the provided job title.
 * This function is designed to be an Express.js controller.
 * @param {object} req - The Express request object. Expects req.body to contain:
 * - 'interviewData': An array of objects with 'question' and 'answer' properties.
 * - 'jobTitle': A string representing the job title for which the interview is conducted (e.g., "Junior Software Engineer", "Senior Data Scientist").
 * @param {object} res - The Express response object.
 */
const evaluateAnswers = async (req, res) => {
    const { interviewData, jobTitle } = req.body; // Destructure to get interviewData and jobTitle

    // Validate input
    if (!Array.isArray(interviewData) || interviewData.length === 0) {
        return res.status(400).json({ error: 'Request body must contain a non-empty "interviewData" array.' });
    }
    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim() === '') {
        return res.status(400).json({ error: 'Request body must contain a valid "jobTitle" string.' });
    }

    try {
        let chatHistory = [];

        // Construct the prompt for the AI agent, including the jobTitle
        const prompt = `
            You are an expert interviewer and AI assistant tasked with evaluating candidate responses to interview questions.
            The candidate is being interviewed for the role of a **${jobTitle}**.
            When evaluating, consider the expected level of knowledge, experience, and depth for a **${jobTitle}** role.
            For example, for junior roles, focus on foundational understanding and clarity, while for senior roles, expect deeper insights, strategic thinking, and practical experience.

            For each question and its corresponding answer, you need to provide:
            1. A concise summary of the answer.
            2. A rating for the answer: "Excellent", "Good", "Average", "Below Average", or "Poor".
            3. Consider the clarity, completeness, relevance, and depth of the answer **relative to the demands of a ${jobTitle} role** when assigning a rating.
            4. If an answer is empty or very short, indicate that in the summary and assign a "Poor" rating, unless it's a question where a short answer is acceptable (e.g., "Yes/No").

            After evaluating each question, you must also provide an **overall rating, a brief overall summary, a list of key strengths, and a list of specific areas for improvement** for the candidate based on all their answers, again, with the **${jobTitle}** role in mind.

            Here are the questions and answers to evaluate:
            ${JSON.stringify(interviewData, null, 2)}

            Please provide the evaluations as a JSON object with two main properties:
            - 'individualEvaluations': An array of objects, each with 'question', 'summary', and 'rating' properties for individual questions.
            - 'overallEvaluation': An object with 'summary', 'rating', 'strengths' (array of strings and each shouldn't have more than 100 characters), and 'areasForImprovement' (array of strings and each shouldn't have more than 100 characters) properties for the overall performance.

            Example format:
            {
                "individualEvaluations": [
                    {
                        "question": "Question 1 text",
                        "summary": "Summary of Answer 1",
                        "rating": "Excellent"
                    },
                    {
                        "question": "Question 2 text",
                        "summary": "Summary of Answer 2",
                        "rating": "Good"
                    }
                ],
                "overallEvaluation": {
                    "summary": "Overall assessment of the candidate's performance across all questions.",
                    "rating": "Good",
                    "strengths": [
                        "Ability to articulate technical concepts",
                        "Solid grasp of core concepts"
                    ],
                    "areasForImprovement": [
                        "Expand on breadth of technical skills",
                        "Could provide more specific examples"
                    ]
                }
            }
        `;

        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        individualEvaluations: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    question: { type: "STRING" },
                                    summary: { type: "STRING" },
                                    rating: { type: "STRING", enum: ["Excellent", "Good", "Average", "Below Average", "Poor"] }
                                },
                                required: ["question", "summary", "rating"]
                            }
                        },
                        overallEvaluation: {
                            type: "OBJECT",
                            properties: {
                                summary: { type: "STRING" },
                                rating: { type: "STRING", enum: ["Excellent", "Good", "Average", "Below Average", "Poor"] },
                                strengths: { // New property
                                    type: "ARRAY",
                                    items: { type: "STRING" }
                                },
                                areasForImprovement: { // New property
                                    type: "ARRAY",
                                    items: { type: "STRING" }
                                }
                            },
                            required: ["summary", "rating", "strengths", "areasForImprovement"] // Updated required fields
                        }
                    },
                    required: ["individualEvaluations", "overallEvaluation"]
                }
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`; // Use process.env for API_KEY

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const jsonString = result.candidates[0].content.parts[0].text;
            const fullEvaluation = JSON.parse(jsonString);

            res.json(fullEvaluation);
        } else {
            console.warn('Gemini API response structure unexpected:', result);
            res.status(500).json({ error: 'Failed to evaluate answers: Unexpected API response format.' });
        }

    } catch (error) {
        console.error('Error evaluating interview answers:', error);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

const identifyCvAndExtractName = async (req, res) => {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Request body must contain a non-empty "text" string.' });
    }

    try {
        let chatHistory = [];

        const prompt = `
            **STRICT INSTRUCTION:** Your response MUST be either the extracted name of a candidate from a CV, or the literal string "interviewer". No other text, explanations, or formatting are allowed.

            Analyze the following text.
            1. Determine if the text is a Curriculum Vitae (CV) or resume.
            2. If it is a CV/resume, attempt to extract the full name of the candidate.
            3. If a name is successfully extracted from a CV/resume, return ONLY that name.
            4. Otherwise (if not a CV/resume, or if a CV/resume but no name is found), return ONLY the string "interviewee".

            Examples:
            Text: "This is a job description for a software engineer role."
            Output: "interviewee"

            Text: "Subject: Application for Software Engineer. Dear Hiring Manager, My name is Alice Smith, and I am writing to apply for..."
            Output: "Alice Smith"

            Text: "CV: John Doe. Experienced software developer with 10 years in the industry..."
            Output: "John Doe"

            Text: "This document outlines project deliverables."
            Output: "interviewee"

            Text: "My resume lists my skills in Python, Java, and C++."
            Output: "interviewee"

            Text to analyze:
            ${text}
        `;

        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
            contents: chatHistory,
            generationConfig: {
                // We don't need a specific schema here as the output is a simple string.
                // We'll parse it as plain text.
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const extractedName = result.candidates[0].content.parts[0].text.trim();
            res.json({ name: extractedName });
        } else {
            console.warn('Gemini API response structure unexpected for name extraction:', result);
            res.status(500).json({ error: 'Failed to identify CV or extract name: Unexpected API response format.' });
        }

    } catch (error) {
        console.error('Error identifying CV or extracting name:', error);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

module.exports = {
    generateQuestions,
    evaluateAnswers,
    identifyCvAndExtractName
};