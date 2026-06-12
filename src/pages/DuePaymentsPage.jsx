import { Card } from '../components/ui/card'
import { MembersTable } from '../tables/MembersTable'
import { useDashboardData } from '../hooks/useDashboardData'
import { exportCsv } from '../utils/csv'

export default function DuePaymentsPage() {
  const { dueMembers, loading, error } = useDashboardData()

  if (loading) return <div className='text-muted'>Loading due payments...</div>
  if (error) return <div className='text-danger'>{error}</div>

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs uppercase tracking-[0.24em] text-accent/80'>Finance alerts</p>
        <h2 className='font-display text-2xl font-bold'>Due payments</h2>
      </div>

      {/* Alert Banner */}
      <Card className='border border-danger/20 bg-danger/5'>
        <div className='flex items-start gap-3'>
          <span className='text-2xl'>⚠️</span>
          <div>
            <p className='font-semibold text-danger'>
              {dueMembers.length} member{dueMembers.length !== 1 ? 's' : ''} require attention
            </p>
            <p className='mt-1 text-sm text-muted'>
              Red rows indicate outstanding dues. Yellow indicates expiring memberships within 30 days.
              Use the export button to download the due members list.
            </p>
          </div>
        </div>
      </Card>

      <MembersTable
        members={dueMembers}
        title='Due and overdue members'
        exportAction={() =>
          exportCsv('due-members.csv', dueMembers.map((m) => ({
            Name: m.full_name,
            'Membership Type': m.membership_type,
            'Contact Number': m.phone_number,
            Email: m.email,
            'Amount Due': m.due_amount,
            'Renewal Date': m.renewal_date,
            'Membership Validity': m.valid_till,
          })))
        }
      />
    </div>
  )
}