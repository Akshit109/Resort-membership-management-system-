import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Only redirect if truly authenticated (demo mode allows any credentials)
  if (isAuthenticated && (form.email || form.password)) {
    return <Navigate to='/admin' replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await login(form.email, form.password)
    setLoading(false)
    if (error) setError(error.message)
    else {
      // Demo mode: any credentials work
      return <Navigate to='/admin' replace />
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-md'>

        {/* Logo */}
        <div className='mb-8 flex items-center gap-3'>
          <svg viewBox='0 0 48 48' className='h-12 w-12 text-accent' fill='none'>
            <path d='M10 32L24 10L38 32' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M16 32H32' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
            <circle cx='24' cy='36' r='3' fill='currentColor' />
          </svg>
          <div>
            <p className='font-display text-2xl font-bold'>Best Western</p>
            <p className='text-xs uppercase tracking-[0.28em] text-muted'>Resort Country Club</p>
          </div>
        </div>

        <Card className='border border-accent/15'>
          <p className='text-xs uppercase tracking-[0.3em] text-accent/80'>Admin authentication</p>
          <h1 className='mt-2 font-display text-3xl font-bold'>Secure access</h1>
          <p className='mt-2 text-sm text-muted'>
            Sign in to access the membership management system.
          </p>

          <div className='mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-accent'>
            💡 Demo mode: Enter **any email and password** (e.g. admin@example.com / admin123) to access the dashboard.
          </div>

          <form className='mt-6 space-y-4' onSubmit={onSubmit}>
            <label className='block space-y-2 text-sm'>
              <span className='text-muted'>Email address</span>
              <Input
                type='email'
                placeholder='admin@example.com'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className='block space-y-2 text-sm'>
              <span className='text-muted'>Password</span>
              <Input
                type='password'
                placeholder='admin123'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            {error && (
              <p className='rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger'>
                {error}
              </p>
            )}

            <Button className='w-full' disabled={loading}>
              {loading ? 'Signing in...' : 'Login to dashboard'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}