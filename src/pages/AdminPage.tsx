import {useEffect, useMemo, useRef, useState} from 'react'
import type {ReactNode} from 'react'
import {useAuth} from '../auth/AuthContext'
import type {ImportBatchResponse, QualifiedUserResponse} from '@/types'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'

const formatBirthDate = (value: string) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('de-DE').format(date)
}

const AdminPage = () => {
    const {token} = useAuth()
    const [users, setUsers] = useState<QualifiedUserResponse[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [usersError, setUsersError] = useState('')
    const [minRunsInput, setMinRunsInput] = useState('1')
    const [appliedMinRuns, setAppliedMinRuns] = useState(1)
    const [usersRefreshKey, setUsersRefreshKey] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [importLoading, setImportLoading] = useState(false)
    const [importError, setImportError] = useState('')
    const [importSuccess, setImportSuccess] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true)
            setUsersError('')

            try {
                const response = await fetch(`http://localhost:8080/api/v1/user/users/by-min-runs?minRuns=${appliedMinRuns}`, {
                    method: 'GET',
                    headers: token ? {Authorization: `Bearer ${token}`} : undefined,
                })

                if (!response.ok) {
                    const message = await response.text().catch(() => '')
                    throw new Error(message || 'Benutzer konnten nicht geladen werden.')
                }

                const data = (await response.json()) as QualifiedUserResponse[]
                setUsers(Array.isArray(data) ? data : [])
            } catch (error) {
                setUsersError(
                    error instanceof Error ? error.message : 'Benutzer konnten nicht geladen werden.',
                )
            } finally {
                setLoadingUsers(false)
            }
        }

        void fetchUsers()
    }, [token, appliedMinRuns, usersRefreshKey])

    const applyMinRuns = () => {
        const parsed = Number.parseInt(minRunsInput, 10)
        if (Number.isNaN(parsed) || parsed < 1) {
            setUsersError('minRuns muss mindestens 1 sein.')
            return
        }
        setUsersError('')
        setAppliedMinRuns(parsed)
    }

    const chooseFile = () => {
        fileInputRef.current?.click()
    }

    const uploadExcel = async () => {
        if (!selectedFile) {
            setImportError('Bitte zuerst eine Datei auswählen.')
            return
        }

        setImportLoading(true)
        setImportError('')
        setImportSuccess('')

        try {
            const importEndpoints = [
                'http://localhost:8080/api/v1/imports/excel',
            ]

            let result: ImportBatchResponse | null = null
            let lastErrorMessage = 'Import fehlgeschlagen.'

            for (const endpoint of importEndpoints) {
                const formData = new FormData()
                formData.append('file', selectedFile)

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: token ? {Authorization: `Bearer ${token}`} : undefined,
                    body: formData,
                })

                if (response.ok) {
                    result = (await response.json()) as ImportBatchResponse
                    break
                }

                const message = await response.text().catch(() => '')
                lastErrorMessage = message || `Import fehlgeschlagen (HTTP ${response.status}).`

                if (response.status !== 404) {
                    break
                }
            }

            if (!result) {
                throw new Error(lastErrorMessage)
            }

            setImportSuccess(
                `Import erfolgreich: ${result.createdResults} Datensätze aus "${result.fileName}" (${result.status}).`,
            )

            setSelectedFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            setUsersRefreshKey((value) => value + 1)
        } catch (error) {
            setImportError(error instanceof Error ? error.message : 'Import fehlgeschlagen.')
        } finally {
            setImportLoading(false)
        }
    }

    const qualifiers = useMemo(
        () =>
            users.map((user) => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                birthDate: formatBirthDate(user.birthDate),
                races: user.races,
            })),
        [users],
    )

    return (
        <section className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl">Adminseite für die Sparkasse</h2>
                <p className="text-muted-foreground">
                    Kontrolle über Qualifikationen, Datenimporte und Korrekturen.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Qualifizierte Läufer" value={String(users.length)}/>
                <StatCard label="Geladene Benutzer" value={String(users.length)}/>
                <StatCard label="Letzter Import" value="08.02.2026"/>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Angemeldete User mit abgeschlossenen Läufen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Minimale Läufe (minRuns)</p>
                            <p className="text-sm text-muted-foreground">
                                Aktiver Filter: {appliedMinRuns}
                            </p>
                        </div>
                        <div className="flex w-full gap-2 md:w-auto">
                            <Input
                                type="number"
                                min={1}
                                value={minRunsInput}
                                onChange={(event) => setMinRunsInput(event.target.value)}
                                className="md:w-40"
                            />
                            <Button onClick={applyMinRuns}>Anwenden</Button>
                        </div>
                    </div>
                    <div
                        className="hidden grid-cols-[minmax(280px,1.4fr)_1fr_1.1fr_150px_120px] gap-4 px-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                        <span>ID</span>
                        <span>Läufer</span>
                        <span>E-Mail</span>
                        <span>Geburtsdatum</span>
                        <span className="text-right">Runs</span>
                    </div>
                    <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
                        {loadingUsers && <p className="text-base text-muted-foreground">Benutzer werden geladen...</p>}
                        {!loadingUsers && usersError && <p className="text-base text-destructive">{usersError}</p>}
                        {!loadingUsers &&
                            !usersError &&
                            qualifiers.map((runner) => (
                                <div
                                    key={runner.id}
                                    className="grid gap-2 rounded-lg border bg-muted/30 p-4 md:grid-cols-[minmax(280px,1.4fr)_1fr_1.1fr_150px_120px] md:items-center"
                                >
                                    <p className="font-mono text-sm font-medium break-all">{runner.id}</p>
                                    <p className="font-medium">{runner.name || '-'}</p>
                                    <p className="truncate text-muted-foreground">{runner.email}</p>
                                    <Badge variant="secondary" className="justify-center md:justify-self-end">
                                        {runner.birthDate}
                                    </Badge>
                                    <p className="text-right font-semibold">{runner.races}</p>
                                </div>
                            ))}
                        {!loadingUsers && !usersError && qualifiers.length === 0 && (
                            <p className="text-base text-muted-foreground">Keine Benutzer gefunden.</p>
                        )}
                    </div>
                    <Button variant="secondary">Exportieren</Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manuelle Anpassung der Daten</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="Läufer ID">
                            <Input type="text" placeholder="z.B. 104233"/>
                        </FormField>
                        <FormField label="Event-Anzahl korrigieren">
                            <Input type="number" placeholder="12"/>
                        </FormField>
                        <FormField label="Kommentar">
                            <Input type="text" placeholder="Nachtrag vom Veranstalter"/>
                        </FormField>
                        <Button className="w-full">Änderung speichern</Button>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-indigo-50">
                    <CardHeader>
                        <CardTitle>Admin Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Echtzeitüberblick über neue Qualifikationen, Imports und offene Prüfungen.
                        </p>
                        <div className="space-y-2">
                            <AlertRow label="7 neue Qualifikationen" value="Heute"/>
                            <AlertRow label="2 Datensätze warten" value="Prüfen"/>
                            <AlertRow label="Nächstes Event" value="22.03.2026"/>
                        </div>
                        <Button variant="outline">Zur Übersicht</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datensätze importieren</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={(event) => {
                            const next = event.target.files?.[0] ?? null
                            setSelectedFile(next)
                            setImportError('')
                            setImportSuccess('')
                        }}
                    />
                    <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center">
                        <p className="mb-3 text-base text-muted-foreground">CSV oder Excel auswählen</p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button variant="outline" onClick={chooseFile}>
                                Datei auswählen
                            </Button>
                            <Button onClick={uploadExcel} disabled={!selectedFile || importLoading}>
                                {importLoading ? 'Import läuft...' : 'Import starten'}
                            </Button>
                        </div>
                        {selectedFile && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Ausgewählt: {selectedFile.name}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-base">
                        <span className="text-muted-foreground">Letzte Prüfung:</span>
                        <strong>Fehlerfrei</strong>
                    </div>
                    {importSuccess && <p className="text-sm font-medium text-primary">{importSuccess}</p>}
                    {importError && <p className="text-sm font-medium text-destructive">{importError}</p>}
                </CardContent>
            </Card>
        </section>
    )
}

const StatCard = ({label, value}: { label: string; value: string }) => (
    <Card>
        <CardContent className="space-y-1 p-5">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
    </Card>
)

const FormField = ({label, children}: { label: string; children: ReactNode }) => (
    <label className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        {children}
    </label>
)

const AlertRow = ({label, value}: { label: string; value: string }) => (
    <div className="flex items-center justify-between rounded-lg border bg-background/70 px-3 py-2 text-sm">
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
)

export default AdminPage
