const AdminPage = () => {
  const qualifiers = Array.from({ length: 100 }, (_, index) => {
    const events = 6 + (index % 20)
    return {
      name: `Läufer ${index + 1}`,
      events,
      gift: events >= 14 || index % 3 === 0 ? 'Großes Geschenk' : 'Kleines Geschenk',
    }
  })

  return (
    <section className="section admin">
      <div className="section-header">
        <h2>Adminseite für die Sparkasse</h2>
        <p>Kontrolle über Qualifikationen, Datenimporte und Korrekturen.</p>
      </div>
      <div className="grid three">
        <div className="card stat">
          <span className="stat-label">Qualifizierte Läufer</span>
          <span className="stat-value">312</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Großes Geschenk</span>
          <span className="stat-value">74</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Letzter Import</span>
          <span className="stat-value">08.02.2026</span>
        </div>
      </div>

      <div className="grid two">
        <div className="card panel">
          <h3>Wer hat sich qualifiziert?</h3>
          <div className="table-scroll">
            <div className="table">
              <div className="table-head">
                <span>Läufer</span>
                <span>Events</span>
                <span>Geschenk</span>
              </div>
              {qualifiers.map((runner) => (
                <div className="table-row" key={runner.name}>
                  <div>
                    <p className="event-name">{runner.name}</p>
                  </div>
                  <span>{runner.events}</span>
                  <span className="badge">{runner.gift}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn secondary">Exportieren</button>
        </div>

        <div className="card panel">
          <h3>Datensätze importieren</h3>
          <div className="dropzone">
            <p>CSV oder Excel hierher ziehen</p>
            <button className="btn ghost">Datei auswählen</button>
          </div>
          <div className="import-info">
            <span>Letzte Prüfung:</span>
            <strong>Fehlerfrei</strong>
          </div>
        </div>
      </div>

      <div className="grid two">
        <div className="card panel">
          <h3>Manuelle Anpassung der Daten</h3>
          <label>
            Läufer ID
            <input type="text" placeholder="z.B. 104233" />
          </label>
          <label>
            Event-Anzahl korrigieren
            <input type="number" placeholder="12" />
          </label>
          <label>
            Kommentar
            <input type="text" placeholder="Nachtrag vom Veranstalter" />
          </label>
          <button className="btn primary full">Änderung speichern</button>
        </div>
        <div className="card panel highlight">
          <h3>Admin Dashboard</h3>
          <p>
            Echtzeitüberblick über neue Qualifikationen, Imports und offene
            Prüfungen.
          </p>
          <div className="alerts">
            <div className="alert-item">
              <span>7 neue Qualifikationen</span>
              <strong>Heute</strong>
            </div>
            <div className="alert-item">
              <span>2 Datensätze warten</span>
              <strong>Prüfen</strong>
            </div>
            <div className="alert-item">
              <span>Nächstes Event</span>
              <strong>22.03.2026</strong>
            </div>
          </div>
          <button className="btn ghost">Zur Übersicht</button>
        </div>
      </div>
    </section>
  )
}

export default AdminPage
