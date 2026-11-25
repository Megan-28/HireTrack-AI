# HireTrack AI — Software Development Fundamentals

## 1. What is HireTrack AI?

HireTrack AI is a full-stack web application designed to help users track job applications and analyze how well their resumes match job descriptions.

The application will have a frontend for users to interact with, a backend to handle requests and business logic, a database to store information, and AI functionality to analyze resumes and job descriptions.

## 2. What is a frontend?

The frontend is the part of an application that users see and interact with.

Examples in HireTrack AI:
- Dashboard displaying job applications.
- Forms for adding new applications.
- Buttons to update application status.
- Visualizations of application statistics.

Planned technology: React with JavaScript.

## 3. What is a backend?

The backend is the part of an application that runs behind the scenes. It processes requests, applies business rules, communicates with the database, and returns results.

Examples in HireTrack AI:
- Adding a job application.
- Retrieving saved applications.
- Updating an application's status.
- Comparing a resume with a job description.

Planned technology: Python with FastAPI.

## 4. What is an API?

API stands for Application Programming Interface.

An API defines how two software components communicate with each other. In a web application, the frontend can send a request to the backend through an API, and the backend returns a response.

Example:
1. The user opens the job dashboard.
2. The frontend requests the user's job applications from the backend.
3. The backend retrieves the records from the database.
4. The backend returns the records through an API response.
5. The frontend displays the applications.

Analogy: An API is like a waiter in a restaurant. The customer makes a request, the waiter carries it to the kitchen, and the waiter brings the result back.

## 5. What is an API endpoint?

An endpoint is a specific URL and HTTP method through which an API provides an operation.

Examples:
- GET /jobs — retrieve job applications.
- POST /jobs — create a job application.
- GET /jobs/1 — retrieve a particular application.
- PUT /jobs/1 — update a particular application.
- DELETE /jobs/1 — delete a particular application.

These are planned examples. They become actual HireTrack AI endpoints only when we implement them.

## 6. What is HTTP?

HTTP stands for Hypertext Transfer Protocol. It is a protocol used by clients and servers to exchange requests and responses over a network.

Common HTTP methods:
- GET: retrieve information.
- POST: create or submit information.
- PUT: update an existing resource.
- PATCH: partially update a resource.
- DELETE: remove a resource.

## 7. What is JSON?

JSON stands for JavaScript Object Notation. It is a common format for exchanging structured data between a frontend and a backend.

Example response:

{
  "id": 1,
  "company": "Example Company",
  "role": "Software Engineer",
  "status": "Applied"
}

The frontend can read this response and display the company, role, and application status.

## 8. What is a server?

A server is a program or computer that receives requests and provides responses or services.

During development, Uvicorn will run our FastAPI application locally. This allows us to test the backend on our own computer before deployment.

## 9. What is a database?

A database stores information in an organized and persistent way.

HireTrack AI will use a database to save job application details, including company name, role, application date, status, and job description.

Planned initial technology: SQLite.

## 10. What is full-stack development?

Full-stack development involves building both the frontend and backend, and integrating them with data storage and other services.

HireTrack AI is a full-stack project because it combines a user interface, backend APIs, database operations, and AI functionality.

## 11. What is a virtual environment in Python?

A Python virtual environment isolates the packages used by a particular project from other Python projects.

HireTrack AI will use a .venv folder to keep its development dependencies separate.

## 12. What is Git and GitHub?

Git is a version control system that records changes to files over time. It helps developers track progress, compare changes, and return to earlier versions.

GitHub is an online platform for hosting Git repositories and collaborating on software projects.

Important commands:
- git status — inspect changed files.
- git add — stage changes for a commit.
- git commit — save a snapshot of staged changes.
- git push — upload local commits to GitHub.
- git pull — retrieve and integrate remote changes.

## 13. What is an environment variable?

An environment variable stores configuration outside the source code. It can be used for settings such as database URLs and API keys.

Secrets should not be hardcoded into source files or committed to GitHub. A .env file can be used locally when configured appropriately and excluded from version control.

## 14. What is deployment?

Deployment is the process of making an application available in an environment where other people can use it, such as a hosted server.

Running HireTrack AI locally is development, not public deployment.

## 15. What is AI-powered resume matching?

Resume matching compares information extracted from a resume with the requirements in a job description.

A basic version can compare skills using keyword matching. A more advanced version can use semantic similarity to identify related concepts even when the wording differs.

The matching method, evaluation approach, and actual performance will be documented after implementation and testing.