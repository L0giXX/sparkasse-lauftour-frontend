import { NavLink, Outlet } from 'react-router'

const SiteLayout = () => {
  return (
    <div className="page">
      <nav className="nav">
        <div className="logo">Lauftour</div>
        <div className="nav-links">
          <NavLink to="/">Willkommen</NavLink>
          <NavLink to="/benutzer">Benutzer</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
        <button className="btn ghost">Kontakt</button>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 Sparkasse Lauftour · Datenschutz · Impressum</p>
      </footer>
    </div>
  )
}

export default SiteLayout
