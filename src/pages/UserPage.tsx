import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../auth/AuthContext'
import type { LoginForm, RegisterForm } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const toIsoDate = (value: string) => {
  if (!value) return value
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? value : value
}

const UserPage = () => {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [loginSuccess, setLoginSuccess] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting, isValid: loginValid },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' }, mode: 'onChange' })

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: {
      errors: registerErrors,
      isSubmitting: registerSubmitting,
      isValid: registerValid,
    },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      birthDate: '',
    },
    mode: 'onChange',
  })

  const resolveErrorMessage = async (response: Response, fallback: string) => {
    const text = await response.text().catch(() => '')
    if (!text) return fallback
    try {
      const parsed = JSON.parse(text) as {
        message?: string
        error?: string
        errors?: string[]
      }
      if (parsed?.message) return parsed.message
      if (parsed?.error) return parsed.error
      if (Array.isArray(parsed?.errors) && parsed.errors.length > 0) {
        return parsed.errors.join(', ')
      }
    } catch {
      return text
    }
    return fallback
  }

  const handleLogin = async (data: LoginForm) => {
    setRegisterSuccess('')
    setLoginError('')
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const fallback =
          response.status === 401
            ? 'E-Mail oder Passwort ist falsch.'
            : response.status === 404
              ? 'Benutzer nicht gefunden.'
              : 'Anmeldung fehlgeschlagen.'
        const message = await resolveErrorMessage(response, fallback)
        throw new Error(message)
      }

      const result = await response.json().catch(() => ({}))
      const token = typeof result?.token === 'string' ? result.token : ''
      const expiresIn = typeof result?.expiresIn === 'number' ? result.expiresIn : 0
      if (!token || !expiresIn) {
        throw new Error('Ungültige Antwort vom Server.')
      }
      const nameFromEmail = data.email.split('@')[0] || 'Läufer'
      setSession({
        name: nameFromEmail,
        role: 'runner',
        token,
        expiresIn,
      })
      setLoginSuccess('Erfolgreich angemeldet. Weiterleitung...')
      navigate('/dashboard')
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen.')
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setLoginSuccess('')
    setRegisterError('')
    try {
      const payload = {
        ...data,
        birthDate: toIsoDate(data.birthDate),
      }

      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const fallback = response.status === 409 ? 'E-Mail existiert bereits.' : 'Registrierung fehlgeschlagen.'
        const message = await resolveErrorMessage(response, fallback)
        throw new Error(message)
      }

      const result = await response.json().catch(() => ({}))
      const token = typeof result?.token === 'string' ? result.token : ''
      const expiresIn = typeof result?.expiresIn === 'number' ? result.expiresIn : 0
      if (!token || !expiresIn) {
        throw new Error('Ungültige Antwort vom Server.')
      }
      const name = `${data.firstName} ${data.lastName}`.trim() || 'Läufer'
      setSession({
        name,
        role: 'runner',
        token,
        expiresIn,
      })
      setRegisterSuccess('Konto erstellt. Weiterleitung...')
      navigate('/dashboard')
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : 'Registrierung fehlgeschlagen.',
      )
    }
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl">Benutzerseite</h2>
        <p className="max-w-2xl text-muted-foreground">
          Anmeldung oder Registrierung mit klarer Trennung der Nutzerrollen.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Anmeldung</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLoginSubmit(handleLogin)}>
              <FormField label="E-Mail" error={loginErrors.email?.message}>
                <Input
                  type="email"
                  placeholder="name@beispiel.de"
                  {...registerLogin('email', { required: 'E-Mail ist erforderlich' })}
                />
              </FormField>
              <FormField label="Passwort" error={loginErrors.password?.message}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...registerLogin('password', {
                    required: 'Passwort ist erforderlich',
                    minLength: { value: 3, message: 'Mindestens 3 Zeichen' },
                  })}
                />
              </FormField>
              <Button className="w-full" type="submit" disabled={!loginValid || loginSubmitting}>
                {loginSubmitting ? 'Anmelden...' : 'Einloggen'}
              </Button>
              {loginSuccess && <p className="text-sm font-medium text-primary">{loginSuccess}</p>}
              {loginError && <p className="text-sm font-medium text-destructive">{loginError}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrierung</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleRegisterSubmit(handleRegister)}>
              <FormField label="Vorname" error={registerErrors.firstName?.message}>
                <Input
                  type="text"
                  placeholder="Vorname"
                  {...registerRegister('firstName', {
                    required: 'Vorname ist erforderlich',
                  })}
                />
              </FormField>
              <FormField label="Nachname" error={registerErrors.lastName?.message}>
                <Input
                  type="text"
                  placeholder="Nachname"
                  {...registerRegister('lastName', {
                    required: 'Nachname ist erforderlich',
                  })}
                />
              </FormField>
              <FormField label="E-Mail" error={registerErrors.email?.message}>
                <Input
                  type="email"
                  placeholder="name@beispiel.de"
                  {...registerRegister('email', { required: 'E-Mail ist erforderlich' })}
                />
              </FormField>
              <FormField label="Passwort" error={registerErrors.password?.message}>
                <Input
                  type="password"
                  placeholder="Mindestens 6 Zeichen"
                  {...registerRegister('password', {
                    required: 'Passwort ist erforderlich',
                    minLength: { value: 6, message: 'Mindestens 6 Zeichen' },
                  })}
                />
              </FormField>
              <FormField label="Geburtsdatum" error={registerErrors.birthDate?.message}>
                <Input
                  type="date"
                  {...registerRegister('birthDate', {
                    required: 'Geburtsdatum ist erforderlich',
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: 'Format muss JJJJ-MM-TT sein',
                    },
                  })}
                />
              </FormField>
              <Button
                variant="secondary"
                className="w-full"
                type="submit"
                disabled={!registerValid || registerSubmitting}
              >
                {registerSubmitting ? 'Speichern...' : 'Profil anlegen'}
              </Button>
              {registerSuccess && (
                <p className="text-sm font-medium text-primary">{registerSuccess}</p>
              )}
              {registerError && (
                <p className="text-sm font-medium text-destructive">{registerError}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

const FormField = ({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium">{label}</span>
    {children}
    {error && <span className="text-xs text-destructive">{error}</span>}
  </label>
)

export default UserPage
