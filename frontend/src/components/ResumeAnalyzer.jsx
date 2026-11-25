
import { useState } from 'react';

const API_URL = 'http://127.0.0.1:8000';

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyze(event) {
    event.preventDefault();

    if (!resume) {
      setError('Please upload your resume first.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-resume`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="analyzer-section">
      <div className="analyzer-heading">
        <h2>AI Resume Analyzer</h2>
        <p>
          Compare your resume with a job description
          and discover your skill gaps.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="analyzer-form">
        <label>
          Upload Resume (PDF, DOCX or TXT)
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => {
              setResume(event.target.files[0] || null);
              setResult(null);
              setError('');
            }}
          />
        </label>

        {resume && <p>Selected: {resume.name}</p>}

        <label>
          Paste Job Description
          <textarea
            rows="9"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the complete job description here..."
            required
          />
        </label>

        <button
          type="submit"
          className="add-button"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze My Resume'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="analysis-results">
          <div className="score-card">
            <p>Resume Text Similarity</p>
            <h1>{result.match_score}%</h1>
            <p>
              Calculated using TF-IDF and cosine similarity.
              This is a text similarity measure, not a hiring probability.
            </p>
          </div>

          <div className="skill-columns">
            <div className="skill-card">
              <h3>Matching Skills ({result.matched_skills.length})</h3>

              {result.matched_skills.length > 0 ? (
                result.matched_skills.map(skill => (
                  <span className="skill-tag matched" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No matching skills detected.</p>
              )}
            </div>

            <div className="skill-card">
              <h3>Missing Skills ({result.missing_skills.length})</h3>

              {result.missing_skills.length > 0 ? (
                result.missing_skills.map(skill => (
                  <span className="skill-tag missing" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No missing skills detected.</p>
              )}
            </div>
          </div>

          <div className="recommendation-card">
            <h3>Recommendations</h3>
            <ul>
              {result.recommendations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumeAnalyzer;
