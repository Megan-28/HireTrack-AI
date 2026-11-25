# HireTrack AI

**A job application tracking and resume analysis platform built with React, FastAPI, and SQLite.**

HireTrack AI helps job seekers organize their applications, monitor application progress, and compare their resumes against job descriptions to identify relevant and missing skills.

## Features

### 1. Job Application Management
- Add new job applications.
- Track company names, job titles, application dates, and job links.
- Update application statuses.
- Delete applications.
- View application statistics.

### 2. Application Dashboard
- View total applications.
- Track interviews, selections, and rejections.
- View recent applications.
- Search applications by company or job title.
- Filter applications by status.

### 3. AI Resume Analyzer
- Upload resumes in PDF, DOCX, or TXT format.
- Extract text from uploaded resumes.
- Compare resumes against job descriptions.
- Calculate text similarity using TF-IDF and cosine similarity.
- Identify matching and missing skills.
- Generate basic skill development recommendations.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Python, FastAPI |
| Database | SQLite |
| NLP | Scikit-learn, TF-IDF, Cosine Similarity |
| Resume Parsing | PyPDF, python-docx |
| API Communication | REST API, Fetch API |
| Version Control | Git, GitHub |

## System Architecture

```text
              USER
               |
               v
       REACT FRONTEND
          (Vite)
               |
          REST API
               |
               v
        FASTAPI BACKEND
          /         \
         v           v
   APPLICATION    RESUME
    MANAGEMENT   ANALYZER
         |           |
         v           v
      SQLITE      TEXT EXTRACTION
     DATABASE          |
                       v
                 TF-IDF VECTORS
                       |
                       v
                COSINE SIMILARITY
                       |
                       v
                SKILL COMPARISON
                       |
                       v
                 ANALYSIS RESULTS
                       |
                       v
                 REACT FRONTEND
```

## Resume Analysis Methodology

The resume analyzer uses a traditional NLP-based approach.

1. **Text Extraction:** Resume content is extracted from PDF, DOCX, or TXT files.
2. **Text Preprocessing and Vectorization:** TF-IDF converts resume and job description text into numerical feature vectors.
3. **Similarity Calculation:** Cosine similarity measures the similarity between the two text representations.
4. **Skill Extraction:** A predefined skill vocabulary is used to identify skills in both documents.
5. **Skill Gap Analysis:** Detected skills are compared to identify matching and missing skills.
6. **Recommendations:** Basic recommendations are generated based on the identified skill gaps.

**Important:** The similarity score is an indicative text similarity measure, not a probability of being hired or a measure of actual candidate suitability.

## Project Structure

```text
HireTrack-AI/
│
├── backend/
│   ├── main.py
│   ├── resume_analyzer.py
│   │
│   └── database/
│       ├── db.py
│       └── init_db.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ApplicationTable.jsx
│   │   │   └── ResumeAnalyzer.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── index.html
│
├── requirements.txt
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Megan-28/HireTrack-AI.git
cd HireTrack-AI
```

### 2. Set Up the Backend

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```powershell
python -m pip install -r requirements.txt
```

Initialize the SQLite database:

```powershell
python -m backend.database.init_db
```

Start the FastAPI server:

```powershell
python -m uvicorn backend.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root endpoint |
| GET | `/health` | Backend health check |
| GET | `/jobs` | Retrieve applications |
| POST | `/jobs` | Add an application |
| PATCH | `/jobs/{job_id}/status` | Update application status |
| DELETE | `/jobs/{job_id}` | Delete an application |
| POST | `/analyze-resume` | Analyze a resume against a job description |

## Current Limitations

- Resume skill extraction relies on a predefined vocabulary.
- TF-IDF measures textual similarity and does not provide deep semantic understanding.
- Scanned PDFs without extractable text are not supported because OCR is not implemented.
- Recommendations are rule-based rather than generated by a large language model.
- User authentication and multi-user support are not currently implemented.

## Future Enhancements

- Semantic resume matching using sentence embeddings.
- OCR support for scanned resumes.
- More advanced AI-powered resume feedback.
- User authentication and personalized dashboards.
- Application reminders and interview scheduling.
- PostgreSQL integration for larger-scale deployments.

## Author

Developed as a personal software and NLP project to explore full-stack application development, REST API integration, database management, and resume analysis.
