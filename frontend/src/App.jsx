
import { useState, useEffect } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ApplicationTable from './components/ApplicationTable';
import ResumeAnalyzer from './components/ResumeAnalyzer';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    job_link: '',
    status: 'Applied',
    date_applied: new Date().toLocaleDateString('en-CA')
  });

  // Fetch applications from FastAPI.
  async function fetchApplications() {
    try {
      setError('');

      const response = await fetch(`${API_URL}/jobs`);

      if (!response.ok) {
        throw new Error('Could not load applications.');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message + ' Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle changes in the application form.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  }

  // Add a new application.
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');

      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Could not add application.');
      }

      setFormData({
        company: '',
        job_title: '',
        job_link: '',
        status: 'Applied',
        date_applied: new Date().toLocaleDateString('en-CA')
      });

      setShowForm(false);
      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  }

  // Update an application's status.
  async function handleStatusChange(id, status) {
    try {
      const response = await fetch(`${API_URL}/jobs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Could not update status.');
      }

      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete an application.
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Could not delete application.');
      }

      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  }

  // Calculate dashboard statistics.
  const totalApplications = applications.length;

  const interviewCount = applications.filter(
    app => app.status === 'Interview'
  ).length;

  const selectedCount = applications.filter(
    app => app.status === 'Selected'
  ).length;

  const rejectedCount = applications.filter(
    app => app.status === 'Rejected'
  ).length;

  // Convert backend field names for the table component.
  const tableApplications = applications.map(app => ({
    id: app.id,
    company: app.company,
    position: app.job_title,
    date: app.date_applied,
    status: app.status
  }));

  // Search by company/job title and filter by status.
  const filteredApplications = tableApplications.filter(app => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      app.company.toLowerCase().includes(search) ||
      app.position.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function navigateTo(page) {
    setActivePage(page);
    setError('');
    setShowForm(false);
  }

  function openAddForm() {
    setActivePage('My Applications');
    setShowForm(true);
  }

  return (
    <div className="app-container">

      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
      />

      <main className="main-content">

        <header className="top-header">
          <div>
            <h1>{activePage}</h1>
            <p>
              {activePage === 'Dashboard' &&
                "Welcome back! Here's your job search overview."}

              {activePage === 'My Applications' &&
                'Manage and track all your job applications.'}

              {activePage === 'AI Resume Analyzer' &&
                'Analyze your resume against job descriptions.'}

              {activePage === 'Settings' &&
                'Project information and application settings.'}
            </p>
          </div>

          {(activePage === 'Dashboard' ||
            activePage === 'My Applications') && (
            <button
              className="add-button"
              onClick={openAddForm}
            >
              + Add Application
            </button>
          )}
        </header>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {/* DASHBOARD PAGE */}
        {activePage === 'Dashboard' && (
          <>
            <section className="stats-container">
              <StatCard
                title="Total Applications"
                value={totalApplications}
              />

              <StatCard
                title="Interviews"
                value={interviewCount}
              />

              <StatCard
                title="Selected"
                value={selectedCount}
              />

              <StatCard
                title="Rejected"
                value={rejectedCount}
              />
            </section>

            <section className="applications-section">
              <div className="section-heading">
                <div>
                  <h2>Recent Applications</h2>
                  <p>Your latest job application activity.</p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => navigateTo('My Applications')}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <p>Loading applications...</p>
              ) : tableApplications.length === 0 ? (
                <div className="empty-state">
                  <h3>No applications yet</h3>
                  <p>Add your first job application to get started.</p>
                  <button
                    className="add-button"
                    onClick={openAddForm}
                  >
                    Add Your First Application
                  </button>
                </div>
              ) : (
                <ApplicationTable
                  applications={tableApplications.slice(0, 5)}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              )}
            </section>
          </>
        )}

        {/* MY APPLICATIONS PAGE */}
        {activePage === 'My Applications' && (
          <>
            {showForm && (
              <section className="form-section">
                <div className="section-heading">
                  <h2>Add New Application</h2>
                  <button
                    className="secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="application-form"
                >
                  <input
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="job_title"
                    placeholder="Job title"
                    value={formData.job_title}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="job_link"
                    placeholder="Job posting URL (optional)"
                    value={formData.job_link}
                    onChange={handleChange}
                  />

                  <label>
                    Date applied
                    <input
                      type="date"
                      name="date_applied"
                      value={formData.date_applied}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button type="submit" className="add-button">
                    Save Application
                  </button>
                </form>
              </section>
            )}

            <section className="applications-section">
              <div className="section-heading">
                <div>
                  <h2>All Applications</h2>
                  <p>
                    {filteredApplications.length} application(s) found
                  </p>
                </div>
              </div>

              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Search company or job title..."
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />

                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {loading ? (
                <p>Loading applications...</p>
              ) : (
                <ApplicationTable
                  applications={filteredApplications}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              )}
            </section>
          </>
        )}

        {/* RESUME ANALYZER PAGE */}
        {activePage === 'AI Resume Analyzer' && (
          <ResumeAnalyzer />
        )}

        {/* SETTINGS PAGE */}
        {activePage === 'Settings' && (
          <section className="settings-section">
            <h2>About HireTrack AI</h2>

            <p>
              HireTrack AI is a job application tracking and resume
              analysis platform designed to help candidates organize
              their job search.
            </p>

            <div className="settings-item">
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>

            <div className="settings-item">
              <span>Backend</span>
              <strong>Python + FastAPI</strong>
            </div>

            <div className="settings-item">
              <span>Database</span>
              <strong>SQLite</strong>
            </div>

            <div className="settings-item">
              <span>Resume Analysis</span>
              <strong>TF-IDF + Cosine Similarity</strong>
            </div>

            <p className="settings-note">
              Resume analysis provides an indicative text similarity
              score and skill comparison. It does not predict hiring
              outcomes.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;
