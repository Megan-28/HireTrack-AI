
import re
from io import BytesIO

from docx import Document
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SKILLS = [
    "python", "java", "javascript", "typescript", "c", "c++",
    "react", "angular", "node.js", "fastapi", "django", "flask",
    "html", "css", "sql", "mysql", "postgresql", "sqlite",
    "mongodb", "git", "github", "docker", "kubernetes",
    "aws", "azure", "machine learning", "deep learning",
    "artificial intelligence", "nlp", "natural language processing",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "data analysis", "data visualization", "power bi", "tableau",
    "rest api", "api development", "data structures",
    "algorithms", "problem solving", "communication",
    "project management", "linux", "excel"
]


def extract_resume_text(filename, file_bytes):
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "pdf":
        reader = PdfReader(BytesIO(file_bytes))
        text = "\n".join(
            page.extract_text() or "" for page in reader.pages
        )

    elif extension == "docx":
        document = Document(BytesIO(file_bytes))
        text = "\n".join(
            paragraph.text for paragraph in document.paragraphs
        )

    elif extension == "txt":
        text = file_bytes.decode("utf-8", errors="ignore")

    else:
        raise ValueError("Only PDF, DOCX and TXT files are supported.")

    if not text.strip():
        raise ValueError(
            "No readable text found. This may be a scanned PDF."
        )

    return text


def extract_skills(text):
    normalized_text = text.lower()
    found = []

    for skill in SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill.lower()) + r"(?!\w)"

        if re.search(pattern, normalized_text):
            found.append(skill)

    return found


def analyze_resume(resume_text, job_description):
    if not resume_text.strip() or not job_description.strip():
        raise ValueError("Resume and job description cannot be empty.")

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2)
    )

    vectors = vectorizer.fit_transform([
        resume_text,
        job_description
    ])

    similarity = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]

    match_score = round(float(similarity) * 100, 2)

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    matched_skills = [
        skill for skill in job_skills if skill in resume_skills
    ]

    missing_skills = [
        skill for skill in job_skills if skill not in resume_skills
    ]

    if not job_skills:
        recommendations = [
            "No recognizable skills were detected in the job description.",
            "Try providing a more detailed job description."
        ]

    elif missing_skills:
        recommendations = [
            f"Consider developing your knowledge of {skill}."
            for skill in missing_skills[:5]
        ]

    else:
        recommendations = [
            "Your resume contains all the skills detected in this job description.",
            "Consider adding measurable achievements to strengthen your resume."
        ]

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "recommendations": recommendations
    }
