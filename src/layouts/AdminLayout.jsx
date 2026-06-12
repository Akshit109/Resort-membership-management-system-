import { Bell, CreditCard, LayoutDashboard, LogOut, Menu, Upload, Users, Wallet } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/payments', icon: Wallet, label: 'Payments' },
  { to: '/admin/due-payments', icon: CreditCard, label: 'Due Payments' },
  { to: '/admin/imports', icon: Upload, label: 'CSV Imports' },
]

function Brand() {
  return (
    <div className='flex items-center gap-3'>
      <svg viewBox='0 0 48 48' className='h-10 w-10 text-accent' fill='none'>
        <path d='M10 32L24 10L38 32' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16 32H32' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
        <circle cx='24' cy='36' r='3' fill='currentColor' />
      </svg>
      <div>
        <p className='font-display text-lg font-bold tracking-wide'>Best Western</p>
        <p className='text-xs uppercase tracking-[0.28em] text-muted'>Resort members</p>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <div className='min-h-screen bg-background text-text lg:grid lg:grid-cols-[280px_1fr]'>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-white/10 bg-black/50 p-5 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Brand />

        <nav className='mt-8 space-y-2'>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-text',
                isActive && 'bg-accent/10 text-accent gold-ring'
              )}
              onClick={() => setOpen(false)}
            >
              <Icon className='h-4 w-4' />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='mt-auto pt-6'>
          <Button
            variant='ghost'
            className='w-full border border-white/10'
            onClick={logout}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className='fixed inset-0 z-30 bg-black/60 lg:hidden'
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className='flex min-h-screen flex-col'>
        <header className='sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-background/80 px-4 py-4 backdrop-blur xl:px-8'>
          <div className='flex items-center gap-3'>
            <button
              className='rounded-xl border border-white/10 p-2 lg:hidden'
              onClick={() => setOpen((prev) => !prev)}
            >
              <Menu className='h-5 w-5' />
            </button>
            <div>
              <p className='text-xs uppercase tracking-[0.24em] text-accent/80'>Luxury resort admin</p>
              <h1 className='font-display text-2xl font-bold'>Membership command center</h1>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button className='relative rounded-xl border border-white/10 p-2'>
              <Bell className='h-5 w-5 text-accent' />
              <span className='absolute -right-1 -top-1 rounded-full bg-danger px-1.5 text-[10px] font-semibold'>
                3
              </span>
            </button>
          </div>
        </header>

        <main className='flex-1 px-4 py-6 xl:px-8'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}