import { useState } from 'react'
import { toast } from 'sonner'
import { MemberForm } from '../forms/MemberForm'
import { MembersTable } from '../tables/MembersTable'
import { useDashboardData } from '../hooks/useDashboardData'
import { upsertMember } from '../services/memberService'
import { exportCsv } from '../utils/csv'
import { EditMemberModal } from '../forms/EditMemberModal'
import { supabase } from '../supabase/client'

export default function MembersPage() {
  const { members, membershipTypes, loading, error, refetch } = useDashboardData()
  const [editingMember, setEditingMember] = useState(null)

  if (loading) return <div className='text-muted'>Loading members...</div>
  if (error) return <div className='text-danger'>{error}</div>

  return (
    <div className='space-y-6'>
      <MemberForm
        membershipTypes={membershipTypes}
        defaultValues={{
          full_name: '',
          membership_type: membershipTypes[0] || '',
          email: '',
          phone_number: '',
          address: '',
          membership_start_date: '',
          membership_end_date: '',
          valid_till: '',
          payment_status: 'Pending',
          amount_paid: 0,
          total_amount: 0,
          renewal_date: '',
          notes: '',
        }}
        onSubmit={async (values) => {
          try {
            const payload = {
              ...values,
              membership_start_date: values.membership_start_date || null,
              membership_end_date: values.membership_end_date || null,
              valid_till: values.valid_till || null,
              renewal_date: values.renewal_date || null,
            }

            await upsertMember(payload)
            toast.success('Member saved successfully!')
            await refetch()
          } catch (err) {
            toast.error(err.message || 'Failed to save member.')
          }
        }}
      />

      <MembersTable
        members={members}
        allowDelete
        onEdit={setEditingMember}
        exportAction={() =>
          exportCsv(
            'all-members.csv',
            members.map((m) => ({
              Name: m.full_name,
              'Membership Type': m.membership_type,
              'Contact Number': m.phone_number,
              Email: m.email,
              'Amount Due': m.due_amount,
              'Renewal Date': m.renewal_date,
              'Membership Validity': m.valid_till,
            }))
          )
        }
      />

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          membershipTypes={membershipTypes}
          onClose={() => setEditingMember(null)}
          onSaved={async () => {
            setEditingMember(null)
            await refetch()
            toast.success('Member updated successfully!')
          }}
        />
      )}
    </div>
  )
}