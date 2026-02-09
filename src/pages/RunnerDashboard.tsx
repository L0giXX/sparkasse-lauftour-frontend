const RunnerDashboard = () => {
  const stats = [
    { label: 'Events 2025', value: '12' },
    { label: 'Kilometer gesamt', value: '428 km' },
    { label: 'Aktuelle Serie', value: '5 Läufe' },
    { label: 'Geschenke-Status', value: 'Kleines Geschenk erreicht' },
  ]

  const pastEvents = [
    { name: 'Winterlauf Nord', date: '12.01.2026', distance: '10 km', points: 120 },
    { name: 'Silvesterlauf', date: '31.12.2025', distance: '6 km', points: 90 },
    { name: 'Herbstlauf West', date: '09.11.2025', distance: '15 km', points: 150 },
  ]

  return (
    <section className="section">
      <div className="section-header">
        <h2>Dashboard für Läufer</h2>
        <p>Alle Laufdaten, Events und Einstellungen an einem Ort.</p>
      </div>
      <div className="grid four">
        {stats.map((stat) => (
          <div className="card stat" key={stat.label}>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid two">
        <div className="card panel">
          <h3>Laufdaten</h3>
          <div className="metrics">
            <div>
              <span>Durchschnittliche Pace</span>
              <strong>5:12 min/km</strong>
            </div>
            <div>
              <span>Beste 10 km Zeit</span>
              <strong>48:30</strong>
            </div>
            <div>
              <span>Letzter Lauf</span>
              <strong>08.02.2026 • 7 km</strong>
            </div>
          </div>
          <button className="btn ghost">Laufdaten aktualisieren</button>
        </div>

        <div className="card panel">
          <h3>Bisherige Teilnahme an Events</h3>
          <div className="table">
            {pastEvents.map((event) => (
              <div className="table-row" key={event.name}>
                <div>
                  <p className="event-name">{event.name}</p>
                  <p className="event-date">{event.date}</p>
                </div>
                <span>{event.distance}</span>
                <span className="badge">{event.points} Punkte</span>
              </div>
            ))}
          </div>
          <button className="btn secondary">Event hinzufügen</button>
        </div>
      </div>

      <div className="grid two">
        <div className="card panel">
          <h3>Persönliche Anmeldedaten verändern</h3>
          <label>
            Kontakt-E-Mail
            <input type="email" placeholder="lauf@beispiel.de" />
          </label>
          <label>
            Verein
            <input type="text" placeholder="Lauftreff Innenstadt" />
          </label>
          <label>
            Notfallkontakt
            <input type="text" placeholder="+49 170 123 4567" />
          </label>
          <button className="btn primary full">Änderungen speichern</button>
        </div>
        <div className="card panel highlight">
          <h3>Qualifikation für Geschenke</h3>
          <p>
            Aktuell qualifiziert für das <strong>kleine Geschenk</strong>. Noch
            8 Events bis zum großen Geschenk.
          </p>
          <div className="gift-grid">
            <div>
              <span className="gift-label">Kleines Geschenk</span>
              <span className="gift-status active">Erreicht</span>
            </div>
            <div>
              <span className="gift-label">Großes Geschenk</span>
              <span className="gift-status">In Arbeit</span>
            </div>
          </div>
          <button className="btn ghost">Details ansehen</button>
        </div>
      </div>
    </section>
  )
}

export default RunnerDashboard
