import React from 'react'
import CvUpload from './CvUpload'


const jobRole = "Intern Software Engineer";
const jobDescription = `
About the Role: Intern Software Engineer

Paycor is seeking a talented and passionate Intern Software Engineer with basic understanding in React to join our growing engineering team. You will play a support role in building and maintaining user-facing applications, contributing to the entire software development lifecycle. This is an exciting opportunity to work on challenging projects, collaborate with a skilled team, and make a significant impact on our products.


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
- Proven experience (3+ years) as a Frontend Developer with a strong focus on React.
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
- Health, dental, and vision insurance.
- Flexible work arrangements.
- Professional development budget.
`;

function InternSoftwareEngineer() {
  return (
    <CvUpload 
    jobRole={jobRole}
    jobDescription={jobDescription}
    />
  )
}

export default InternSoftwareEngineer