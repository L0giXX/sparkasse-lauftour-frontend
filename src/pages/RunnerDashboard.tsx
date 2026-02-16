import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ReactNode } from 'react'

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
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl">Dashboard für Läufer</h2>
        <p className="text-muted-foreground">
          Alle Laufdaten, Events und Einstellungen an einem Ort.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="space-y-1 p-5">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Laufdaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Metric label="Durchschnittliche Pace" value="5:12 min/km" />
            <Metric label="Beste 10 km Zeit" value="48:30" />
            <Metric label="Letzter Lauf" value="08.02.2026 • 7 km" />
            <Button variant="outline">Laufdaten aktualisieren</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bisherige Teilnahme an Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastEvents.map((event) => (
              <div
                key={event.name}
                className="grid items-center gap-2 rounded-lg border bg-muted/40 p-3 sm:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <span className="text-sm font-medium">{event.distance}</span>
                <Badge variant="secondary">{event.points} Punkte</Badge>
              </div>
            ))}
            <Button variant="secondary">Event hinzufügen</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Anmeldedaten verändern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Kontakt-E-Mail">
              <Input type="email" placeholder="lauf@beispiel.de" />
            </FormField>
            <FormField label="Verein">
              <Input type="text" placeholder="Lauftreff Innenstadt" />
            </FormField>
            <FormField label="Notfallkontakt">
              <Input type="text" placeholder="+49 170 123 4567" />
            </FormField>
            <Button className="w-full">Änderungen speichern</Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-blue-50">
          <CardHeader>
            <CardTitle>Qualifikation für Geschenke</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aktuell qualifiziert für das <strong>kleine Geschenk</strong>. Noch
              8 Events bis zum großen Geschenk.
            </p>
            <div className="space-y-3 rounded-lg border bg-background/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kleines Geschenk</span>
                <Badge>Erreicht</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Großes Geschenk</span>
                <Badge variant="outline">In Arbeit</Badge>
              </div>
            </div>
            <Button variant="outline">Details ansehen</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-muted/30 p-3">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
)

const FormField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium">{label}</span>
    {children}
  </label>
)

export default RunnerDashboard
