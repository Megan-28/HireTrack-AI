
import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ApplicationTable from './components/ApplicationTable';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    job_link: '',
    status: 'Applied',
    date_applied: new Date().toLocaleDateString('en-CA')
  });

  // Load applications from FastAPI when the page opens.
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

  // Update form fields as the user types.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Send a new application to the backend.
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

  // Convert backend field names into the names used by our table.
  const tableApplications = applications.map(app => ({
    id: app.id,
    company: app.company,
    position: app.job_title,
    date: app.date_applied,
    status: app.status
  }));

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your job search overview.</p>
          </div>

          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Add Application'}
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}

        {showForm && (
          <section className="form-section">
            <h2>Add New Application</h2>

            <form onSubmit={handleSubmit} className="application-form">
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

        <section className="stats-container">
          <StatCard title="Total Applications" value={totalApplications} />
          <StatCard title="Interviews" value={interviewCount} />
          <StatCard title="Selected" value={selectedCount} />
          <StatCard title="Rejected" value={rejectedCount} />
        </section>

        <section className="applications-section">
          <h2>My Applications</h2>

          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <ApplicationTable
              applications={tableApplications}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
