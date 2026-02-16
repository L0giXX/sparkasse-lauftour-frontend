import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <section className="flex min-h-[50vh] flex-col items-start justify-center gap-4">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">404</p>
      <h2 className="text-4xl">Seite nicht gefunden</h2>
      <p className="text-muted-foreground">Die gewünschte Seite existiert nicht.</p>
      <Link to="/">
        <Button>Zur Startseite</Button>
      </Link>
    </section>
  )
}

export default NotFound
