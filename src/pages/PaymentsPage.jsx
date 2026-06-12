import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDashboardData } from '../hooks/useDashboardData'
import { currency, formatDate } from '../lib/utils'

export default function PaymentsPage() {
  const { payments, loading, error } = useDashboardData()

  if (loading) return <div className='text-muted'>Loading payments...</div>
  if (error) return <div className='text-danger'>{error}</div>

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs uppercase tracking-[0.24em] text-accent/80'>Finance module</p>
        <h2 className='font-display text-2xl font-bold'>Payment management</h2>
      </div>

      <Card>
        <p className='text-sm text-muted mb-4'>All recorded transactions</p>
        <div className='space-y-3'>
          {payments.map((payment) => (
            <div
              key={payment.id}
              className='flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04] md:flex-row md:items-center'
            >
              <div>
                <p className='font-medium'>
                  {payment.members?.full_name || payment.member_id}
                </p>
                <p className='text-sm text-muted'>
                  {payment.method} • {formatDate(payment.paid_on)}
                </p>
                {payment.notes && (
                  <p className='mt-1 text-xs text-muted'>{payment.notes}</p>
                )}
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <p className='text-lg font-semibold'>{currency(payment.amount)}</p>
                  <p className='text-xs text-muted'>Recorded amount</p>
                </div>
                <Badge tone={payment.status}>{payment.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}