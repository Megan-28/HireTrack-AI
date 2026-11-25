
from fastapi import FastAPI, HTTPException
from backend.database.db import get_connection
from backend.schemas import JobCreate, JobStatusUpdate
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form
from backend.resume_analyzer import (
    extract_resume_text,
    analyze_resume
)

app = FastAPI(
    title="HireTrack AI API",
    description="Backend for the HireTrack AI job application tracker",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to HireTrack AI!",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Add a new job application
@app.post("/jobs")
def create_job(job: JobCreate):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO jobs
        (company, job_title, job_link, status, date_applied)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            job.company,
            job.job_title,
            job.job_link,
            job.status,
            job.date_applied.isoformat()
        )
    )

    connection.commit()

    job_id = cursor.lastrowid

    saved_job = connection.execute(
        "SELECT * FROM jobs WHERE id = ?",
        (job_id,)
    ).fetchone()

    connection.close()

    return dict(saved_job)


# Retrieve all job applications
@app.get("/jobs")
def get_jobs():
    connection = get_connection()

    jobs = connection.execute(
        "SELECT * FROM jobs ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(job) for job in jobs]
# Update the status of a job application
@app.patch("/jobs/{job_id}/status")
def update_job_status(job_id: int, job_update: JobStatusUpdate):

    connection = get_connection()

    cursor = connection.execute(
        """
        UPDATE jobs
        SET status = ?
        WHERE id = ?
        """,
        (job_update.status, job_id)
    )

    connection.commit()

    if cursor.rowcount == 0:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Job application not found"
        )

    updated_job = connection.execute(
        "SELECT * FROM jobs WHERE id = ?",
        (job_id,)
    ).fetchone()

    connection.close()

    return dict(updated_job)
# Delete a job application
@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):

    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM jobs WHERE id = ?",
        (job_id,)
    )

    connection.commit()

    if cursor.rowcount == 0:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Job application not found"
        )

    connection.close()

    return {
        "message": "Job application deleted successfully",
        "deleted_job_id": job_id
    }

@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    allowed_extensions = (".pdf", ".docx", ".txt")

    if not resume.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Upload a PDF, DOCX or TXT resume."
        )

    try:
        file_bytes = await resume.read()

        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Resume must be smaller than 5 MB."
            )

        resume_text = extract_resume_text(
            resume.filename,
            file_bytes
        )

        result = analyze_resume(
            resume_text,
            job_description
        )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Resume analysis failed. Please try another file."
        )