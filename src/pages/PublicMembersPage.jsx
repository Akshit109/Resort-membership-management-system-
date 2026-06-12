import { useState } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { formatDate } from '../lib/utils'
import { Input } from '../components/ui/input'
import { MembersTable } from '../tables/MembersTable'
import { hasSupabaseEnv } from '../supabase/client'

export default function PublicMembersPage() {
  const [search, setSearch] = useState('')
  const { members, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-muted'>
        Loading members...
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center text-danger'>
        {error}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-white/10 bg-background/80 px-4 py-6 backdrop-blur-xl xl:px-8'>
        <div className='mx-auto flex max-w-6xl items-center justify-between'>
          <div>
            <p className='font-display text-2xl font-bold'>Best Western</p>
            <p className='text-xs uppercase tracking-[0.28em] text-muted'>Resort Country Club</p>
          </div>
          <a
            href='/login'
            className='rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20'
          >
            Admin Login
          </a>
        </div>
      </header>

      <main className='px-4 py-8 xl:px-8'>
        <div className='mx-auto max-w-6xl space-y-6'>
          <div>
            <h1 className='font-display text-3xl font-bold'>Member Directory</h1>
            <p className='mt-2 text-sm text-muted'>
              View all resort members with membership type, status, and validity.
            </p>
          </div>

          <Input
            placeholder='Search members...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-md'
          />

          <MembersTable members={members} allowDelete={false} showPagination={false} />
        </div>
      </main>
    </div>
  )
}