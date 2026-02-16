import {NavLink, Outlet} from 'react-router'
import {Button, buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'

const navItems = [
    {to: '/', label: 'Willkommen'},
    {to: '/benutzer', label: 'Benutzer'},
    {to: '/dashboard', label: 'Dashboard'},
    {to: '/admin', label: 'Admin'},
]

const SiteLayout = () => {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed_0%,_#f8f5f2_45%,_#eef4ff_100%)]">
            <nav className="sticky top-0 z-20 border-b bg-background/75 backdrop-blur">
                <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-5 py-5 md:px-10">
                    <span className="text-3xl font-semibold tracking-wide">Lauftour</span>
                    <div className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({isActive}) =>
                                    cn(
                                        buttonVariants({variant: 'ghost', size: 'default'}),
                                        isActive && 'bg-accent text-accent-foreground',
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <Button variant="outline" size="default">
                        Kontakt
                    </Button>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-[1680px] px-5 py-10 md:px-10 md:py-12">
                <Outlet/>
            </main>

            <footer
                className="border-t bg-background/40 px-5 py-8 text-center text-base text-muted-foreground md:px-10">
                <p>© 2026 Sparkasse Lauftour · Datenschutz · Impressum</p>
            </footer>
        </div>
    )
}

export default SiteLayout
