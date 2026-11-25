
function ApplicationTable({ applications, onStatusChange, onDelete }) {
  if (applications.length === 0) {
    return <p>No applications yet. Click "Add Application" to get started.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.company}</td>
              <td>{application.position}</td>
              <td>{application.date}</td>

              <td>
                <select
                  className={`status-select ${application.status.toLowerCase()}`}
                  value={application.status}
                  onChange={(event) =>
                    onStatusChange(application.id, event.target.value)
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>

              <td>
                <button
                  className="delete-button"
                  onClick={() => onDelete(application.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;
