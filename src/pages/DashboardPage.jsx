import { Activity, AlertTriangle, Landmark } from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import { Card } from '../components/ui/card'
import { useDashboardData } from '../hooks/useDashboardData'
import { currency, formatDate } from '../lib/utils'

export default function DashboardPage() {
  const { stats, charts, activities, dueMembers, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center text-muted'>
        Loading analytics...
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-2xl border border-danger/20 bg-danger/10 p-6 text-danger'>
        {error}
      </div>
    )
  }

  return (
    <div className='space-y-6'>

      {/* Stat Cards */}
      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard title='Total Members' value={stats.totalMembers} hint='All registered records' />
        <StatCard title='Active Members' value={stats.activeMembers} hint='Currently valid memberships' />
        <StatCard title='Expired Members' value={stats.expiredMembers} hint='Require renewal follow-up' />
        <StatCard title='Lifetime Members' value={stats.lifetimeMembers} hint='Premium permanent tier' />
        <StatCard title='Total Revenue' value={currency(stats.totalRevenue)} hint='Captured across all payments' />
        <StatCard title='Total Due Amount' value={currency(stats.totalDueAmount)} hint='Outstanding balances' />
        <StatCard title='Pending Payments' value={stats.pendingPayments} hint='Pending and partial statuses' />
        <StatCard title='Expiring Soon' value={stats.expiringSoon} hint='Next 30 days alerts' />
      </section>

      {/* Bottom Section */}
      <section className='grid gap-5 xl:grid-cols-[1.2fr_0.8fr]'>

        {/* Renewal Watchlist */}
        <Card>
          <div className='mb-4 flex items-center gap-3'>
            <AlertTriangle className='h-5 w-5 text-warning' />
            <div>
              <p className='text-sm text-muted'>Renewal watchlist</p>
              <h3 className='text-lg font-semibold'>Members needing action</h3>
            </div>
          </div>
          <div className='space-y-3'>
            {dueMembers.length === 0 ? (
              <p className='text-sm text-muted'>No due members. All clear!</p>
            ) : (
              dueMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className='flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center'
                >
                  <div>
                    <p className='font-medium'>{member.full_name}</p>
                    <p className='text-sm text-muted'>
                      {member.membership_type} • Renewal {formatDate(member.renewal_date)}
                    </p>
                  </div>
                  <div className='text-sm text-right'>
                    <p className='text-danger font-semibold'>Due {currency(member.due_amount)}</p>
                    <p className='text-warning'>Valid till {formatDate(member.valid_till)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className='space-y-5'>

          {/* Recent Activity */}
          <Card>
            <div className='mb-4 flex items-center gap-3'>
              <Activity className='h-5 w-5 text-accent' />
              <div>
                <p className='text-sm text-muted'>Recent activity</p>
                <h3 className='text-lg font-semibold'>Admin actions</h3>
              </div>
            </div>
            <div className='space-y-3'>
              {activities.map((activity) => (
                <div key={activity.id} className='rounded-2xl border border-white/10 p-4'>
                  <p className='text-sm font-medium'>{activity.action}</p>
                  <p className='text-xs text-muted'>
                    {activity.actor} • {formatDate(activity.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className='mb-4 flex items-center gap-3'>
              <Landmark className='h-5 w-5 text-accent' />
              <div>
                <p className='text-sm text-muted'>Quick actions</p>
                <h3 className='text-lg font-semibold'>Operations shortcuts</h3>
              </div>
            </div>
            <div className='grid gap-3'>
              {[
                'Add premium member',
                'Renew expiring membership',
                'Export due payments CSV',
              ].map((action) => (
                <button
                  key={action}
                  className='rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm font-medium transition hover:border-accent/30 hover:bg-accent/5'
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>

        </div>
      </section>
    </div>
  )
}