
function Sidebar() {
  return (
    <aside className="sidebar">

      <h2 className="logo">HireTrack AI</h2>

      <nav>
        <a className="nav-link active" href="#">
          Dashboard
        </a>

        <a className="nav-link" href="#">
          My Applications
        </a>

        <a className="nav-link" href="#">
          AI Resume Analyzer
        </a>

        <a className="nav-link" href="#">
          Settings
        </a>
      </nav>

    </aside>
  );
}

export default Sidebar;
