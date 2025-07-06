import React from 'react'
import CvUpload from './CvUpload'

const jobRole = "Business Analyst";
const jobDescription = `
About the Role: Business Analyst

Paycor is seeking a talented and analytical Business Analyst with a basic understanding of business processes and data analysis to join our growing team. You will play a support role in bridging the gap between business needs and technical solutions, contributing to the entire product development lifecycle. This is an exciting opportunity to work on challenging projects, collaborate with a skilled team, and make a significant impact on our products.


Responsibilities:

- Assist in gathering, documenting, and analyzing business requirements from stakeholders.
- Support the creation of detailed functional specifications, user stories, and use cases.
- Collaborate closely with product managers, designers, and engineering teams to ensure clear communication of requirements.
- Participate in data analysis to identify trends, insights, and potential areas for improvement.
- Assist in developing and executing test plans, and validating solutions against requirements.
- Contribute to the creation of process flows, wireframes, and other visual aids to illustrate business concepts.
- Participate in user acceptance testing (UAT) and gather feedback.
- Stay up-to-date with the latest business analysis methodologies, tools, and industry best practices.
- Contribute to the improvement of our business analysis processes and tools.
- Participate in agile ceremonies, including sprint planning, daily stand-ups, and retrospectives.


Requirements:

- Bachelor's degree in Business Administration, Computer Science, Information Systems, or a related field (or equivalent practical experience).
- Basic understanding of business analysis principles and methodologies.
- Familiarity with collecting and documenting business requirements.
- Strong analytical and problem-solving skills.
- Excellent communication (written and verbal) and interpersonal skills.
- Ability to translate business needs into clear and concise documentation.
- Familiarity with data analysis techniques and tools (e.g., Excel).
- Basic understanding of software development lifecycles (SDLC).
- Ability to work independently and as part of a team in an Agile environment.


Bonus Points (Optional):

- Familiarity with specific business analysis tools (e.g., Jira, Confluence, Visio).
- Experience with SQL for data querying.
- Understanding of UI/UX principles.
- Experience with agile project management methodologies.
- Knowledge of data visualization tools (e.g., Tableau, Power BI).
- Contributions to academic projects or relevant extracurricular activities.


What We Offer:

- Competitive salary and benefits package.
- Opportunity to work on challenging and impactful projects.
- A collaborative and supportive work environment.
- Opportunities for professional growth and development.
- Health, dental, and vision insurance.
- Flexible work arrangements.
- Professional development budget.
`;

function InternBusinessAnalyst() {
  return (
    <CvUpload 
    jobRole={jobRole}
    jobDescription={jobDescription}
    />
  )
}

export default InternBusinessAnalyst