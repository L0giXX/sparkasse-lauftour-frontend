import { Link } from 'react-router'

const Welcome = () => {
  const nextEvents = [
    { name: 'Stadtlauf am Fluss', date: '22.03.2026', distance: '10 km' },
    { name: 'Frühlings-Trail', date: '05.04.2026', distance: '18 km' },
    { name: 'Abendlauf City', date: '18.04.2026', distance: '5 km' },
  ]

  return (
    <header className="hero">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="pill">Willkommen bei der Sparkassen Lauftour</p>
          <h1>
            Deine Laufreise in einer klaren Übersicht. Events, Fortschritt und
            Geschenke auf einen Blick.
          </h1>
          <p className="lead">
            Für Läufer: Übersicht über absolvierte Events, Laufdaten und
            Serien. Für die Sparkasse: klare Qualifikationslisten für kleine
            und große Geschenke.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/benutzer">
              Jetzt registrieren
            </Link>
            <Link className="btn secondary" to="/admin">
              Als Admin anmelden
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <span className="meta-value">2.480</span>
              <span className="meta-label">aktive Läufer</span>
            </div>
            <div>
              <span className="meta-value">34</span>
              <span className="meta-label">Events im Jahr</span>
            </div>
            <div>
              <span className="meta-value">8.920</span>
              <span className="meta-label">Gesammelte Läufe</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span>Qualifikationsstatus</span>
            <strong>Aktuell</strong>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: '68%' }} />
          </div>
          <p className="progress-text">17 von 25 Events bis zum großen Geschenk</p>
          <div className="event-list">
            {nextEvents.map((event) => (
              <div className="event-row" key={event.name}>
                <div>
                  <p className="event-name">{event.name}</p>
                  <p className="event-date">{event.date}</p>
                </div>
                <span className="event-distance">{event.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Welcome
