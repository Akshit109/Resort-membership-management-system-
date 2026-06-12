import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { supabase } from '../supabase/client'
export function EditMemberModal({ member, membershipTypes = [], onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: '',
    membership_type: '',
    email: '',
    phone_number: '',
    address: '',
    membership_start_date: '',
    membership_end_date: '',
    valid_till: '',
    payment_status: '',
    amount_paid: 0,
    total_amount: 0,
    renewal_date: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!member) return
    setForm({
      full_name: member.full_name || '',
      membership_type: member.membership_type || membershipTypes[0] || '',
      email: member.email || '',
      phone_number: member.phone_number || '',
      address: member.address || '',
      membership_start_date: member.membership_start_date ? String(member.membership_start_date).slice(0, 10) : '',
      membership_end_date: member.membership_end_date ? String(member.membership_end_date).slice(0, 10) : '',
      valid_till: member.valid_till ? String(member.valid_till).slice(0, 10) : '',
      payment_status: member.payment_status || 'Pending',
      amount_paid: member.amount_paid ?? 0,
      total_amount: member.total_amount ?? 0,
      renewal_date: member.renewal_date ? String(member.renewal_date).slice(0, 10) : '',
      notes: member.notes || '',
    })
  }, [member, membershipTypes])

  if (!member) return null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...form,
      membership_start_date: form.membership_start_date || null,
      membership_end_date: form.membership_end_date || null,
      valid_till: form.valid_till || null,
      renewal_date: form.renewal_date || null,
      amount_paid: Number(form.amount_paid || 0),
      total_amount: Number(form.total_amount || 0),
    }

    const { error } = await supabase.from('members').update(payload).eq('id', member.id)

    setSaving(false)

    if (error) {
      toast.error(error.message || 'Failed to update member.')
      return
    }

    onSaved?.()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
      <div className='w-full max-w-3xl rounded-2xl border border-white/10 bg-background p-6 shadow-xl'>
        <div className='mb-5 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Edit Member</h2>
          <button onClick={onClose} className='text-sm text-muted'>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-2'>
          <Input value={form.full_name} onChange={handleChange('full_name')} placeholder='Full name' />
          <Input value={form.email} onChange={handleChange('email')} placeholder='Email' />
          <Input value={form.phone_number} onChange={handleChange('phone_number')} placeholder='Phone number' />
          <Input value={form.address} onChange={handleChange('address')} placeholder='Address' />
          <Input
            value={form.membership_type}
            onChange={handleChange('membership_type')}
            placeholder='Membership type'
            list='membership-types'
          />
          <datalist id='membership-types'>
            {membershipTypes.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
          <Input type='date' value={form.membership_start_date} onChange={handleChange('membership_start_date')} />
          <Input type='date' value={form.membership_end_date} onChange={handleChange('membership_end_date')} />
          <Input type='date' value={form.valid_till} onChange={handleChange('valid_till')} />
          <Input type='date' value={form.renewal_date} onChange={handleChange('renewal_date')} />
          <Input value={form.payment_status} onChange={handleChange('payment_status')} placeholder='Payment status' />
          <Input type='number' value={form.amount_paid} onChange={handleChange('amount_paid')} placeholder='Amount paid' />
          <Input type='number' value={form.total_amount} onChange={handleChange('total_amount')} placeholder='Total amount' />
          <Input
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder='Notes'
            className='md:col-span-2'
          />

          <div className='md:col-span-2 flex justify-end gap-3'>
            <Button type='button' variant='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}