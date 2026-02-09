import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../auth/AuthContext'

type LoginForm = {
  email: string
  password: string
}

type RegisterForm = {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDate: string
}

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
      const expiresIn =
        typeof result?.expiresIn === 'number' ? result.expiresIn : 0
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
      setLoginError(
        error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen.',
      )
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
        const fallback =
          response.status === 409
            ? 'E-Mail existiert bereits.'
            : 'Registrierung fehlgeschlagen.'
        const message = await resolveErrorMessage(response, fallback)
        throw new Error(message)
      }

      const result = await response.json().catch(() => ({}))
      const token = typeof result?.token === 'string' ? result.token : ''
      const expiresIn =
        typeof result?.expiresIn === 'number' ? result.expiresIn : 0
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
    <section className="section">
      <div className="section-header">
        <h2>Benutzerseite</h2>
        <p>Anmeldung oder Registrierung mit klarer Trennung der Nutzerrollen.</p>
        <p className="hint">Zugriff auf das Dashboard nur nach Anmeldung.</p>
      </div>
      <div className="grid two">
        <form className="card panel" onSubmit={handleLoginSubmit(handleLogin)}>
          <h3>Anmeldung</h3>
          <label>
            E-Mail
            <input
              type="email"
              placeholder="name@beispiel.de"
              {...registerLogin('email', { required: 'E-Mail ist erforderlich' })}
            />
            {loginErrors.email && (
              <span className="form-error">{loginErrors.email.message}</span>
            )}
          </label>
          <label>
            Passwort
            <input
              type="password"
              placeholder="••••••••"
              {...registerLogin('password', {
                required: 'Passwort ist erforderlich',
                minLength: { value: 3, message: 'Mindestens 3 Zeichen' },
              })}
            />
            {loginErrors.password && (
              <span className="form-error">{loginErrors.password.message}</span>
            )}
          </label>
          <button
            className="btn primary full"
            type="submit"
            disabled={!loginValid || loginSubmitting}
          >
            {loginSubmitting ? 'Anmelden...' : 'Einloggen'}
          </button>
          {loginSuccess && <p className="form-success">{loginSuccess}</p>}
          {loginError && <p className="form-error">{loginError}</p>}
          <p className="hint">Passwort vergessen? Zurücksetzen.</p>
        </form>
        <form
          className="card panel"
          onSubmit={handleRegisterSubmit(handleRegister)}
        >
          <h3>Registrierung</h3>
          <label>
            Vorname
            <input
              type="text"
              placeholder="Vorname"
              {...registerRegister('firstName', {
                required: 'Vorname ist erforderlich',
              })}
            />
            {registerErrors.firstName && (
              <span className="form-error">{registerErrors.firstName.message}</span>
            )}
          </label>
          <label>
            Nachname
            <input
              type="text"
              placeholder="Nachname"
              {...registerRegister('lastName', {
                required: 'Nachname ist erforderlich',
              })}
            />
            {registerErrors.lastName && (
              <span className="form-error">{registerErrors.lastName.message}</span>
            )}
          </label>
          <label>
            E-Mail
            <input
              type="email"
              placeholder="name@beispiel.de"
              {...registerRegister('email', { required: 'E-Mail ist erforderlich' })}
            />
            {registerErrors.email && (
              <span className="form-error">{registerErrors.email.message}</span>
            )}
          </label>
          <label>
            Passwort
            <input
              type="password"
              placeholder="Mindestens 6 Zeichen"
              {...registerRegister('password', {
                required: 'Passwort ist erforderlich',
                minLength: { value: 6, message: 'Mindestens 6 Zeichen' },
              })}
            />
            {registerErrors.password && (
              <span className="form-error">{registerErrors.password.message}</span>
            )}
          </label>
          <label>
            Geburtsdatum
            <input
              type="date"
              {...registerRegister('birthDate', {
                required: 'Geburtsdatum ist erforderlich',
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: 'Format muss JJJJ-MM-TT sein',
                },
              })}
            />
            {registerErrors.birthDate && (
              <span className="form-error">
                {registerErrors.birthDate.message}
              </span>
            )}
          </label>
          <button
            className="btn secondary full"
            type="submit"
            disabled={!registerValid || registerSubmitting}
          >
            {registerSubmitting ? 'Speichern...' : 'Profil anlegen'}
          </button>
          {registerSuccess && <p className="form-success">{registerSuccess}</p>}
          {registerError && <p className="form-error">{registerError}</p>}
          <p className="hint">Mit der Registrierung stimmst du den Regeln zu.</p>
        </form>
      </div>
    </section>
  )
}

export default UserPage
