# AI-Powered Resume Optimizer and Job Recommendation System

This is a full-stack web application built with Next.js that analyzes user resumes, optimizes them for ATS (Applicant Tracking Systems), and recommends relevant job roles based on extracted skills and experience.

## Features

-   **Resume Upload & Parsing**: Upload resumes in PDF or DOCX format.
-   **AI Resume Optimization**: Get suggestions to improve your resume.
-   **Job Recommendation Engine**: Discover job roles that match your skills.

## Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **AI Integration**: OpenAI API (with mock fallback)

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/resume-optimizer.git
    cd resume-optimizer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your OpenAI API key:

    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

    If you don't have an API key, the application will use mock data.

### Running the Development Server

To run the application locally, use the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
