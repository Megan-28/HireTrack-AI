
function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'My Applications', icon: '▤' },
    { name: 'AI Resume Analyzer', icon: '✧' },
    { name: 'Settings', icon: '⚙' }
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">HireTrack AI</h2>

      <nav>
        {menuItems.map(item => (
          <button
            key={item.name}
            className={`nav-link ${
              activePage === item.name ? 'active' : ''
            }`}
            onClick={() => onNavigate(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Job search, organized.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
