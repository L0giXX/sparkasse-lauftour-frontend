import { Link } from 'react-router'

const NotFound = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Seite nicht gefunden</h2>
        <p>Die gewünschte Seite existiert nicht.</p>
      </div>
      <Link className="btn primary" to="/">
        Zur Startseite
      </Link>
    </section>
  )
}

export default NotFound
