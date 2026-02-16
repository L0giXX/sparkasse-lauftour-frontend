import {Link} from 'react-router'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

const Welcome = () => {
    const nextEvents = [
        {name: 'Stadtlauf am Fluss', date: '22.03.2026', distance: '10 km'},
        {name: 'Frühlings-Trail', date: '05.04.2026', distance: '18 km'},
        {name: 'Abendlauf City', date: '18.04.2026', distance: '5 km'},
    ]

    return (
        <section className="grid gap-8 pb-8 md:grid-cols-2 md:items-start">
            <div className="space-y-6">
                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
                    Willkommen bei der Sparkassen Lauftour
                </Badge>
                <h1 className="text-4xl leading-tight md:text-5xl">
                    Deine Laufreise in einer klaren Übersicht.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    Für Läufer: Überblick über absolvierte Events und Fortschritt. Für die
                    Sparkasse: klare Qualifikationslisten für kleine und große Geschenke.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link to="/benutzer">
                        <Button variant={"default"}>Jetzt registrieren</Button>
                    </Link>
                    <Link to="/admin">
                        <Button variant={"secondary"}>Jetzt anmelden</Button>
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Stat label="aktive Läufer" value="2.480"/>
                    <Stat label="Events im Jahr" value="34"/>
                    <Stat label="Gesammelte Läufe" value="8.920"/>
                </div>
            </div>

            <Card className="border-foreground/10 bg-card/95 shadow-xl">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xl">Qualifikationsstatus</CardTitle>
                    <Badge variant="outline">Aktuell</Badge>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[68%] bg-gradient-to-r from-primary to-orange-400"/>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        17 von 25 Events bis zum großen Geschenk
                    </p>
                    <div className="space-y-3">
                        {nextEvents.map((event) => (
                            <div
                                key={event.name}
                                className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
                            >
                                <div>
                                    <p className="font-medium">{event.name}</p>
                                    <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                                <Badge variant="secondary">{event.distance}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

const Stat = ({label, value}: { label: string; value: string }) => (
    <Card className="bg-background/80">
        <CardContent className="space-y-1 p-4">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
    </Card>
)

export default Welcome
