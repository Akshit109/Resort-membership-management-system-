import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

function cleanDates(value) {
  if (!value) return null
  const s = String(value).trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  membership_type: z.string().min(2, 'Membership type is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone_number: z.string().min(10, 'Invalid phone'),
  address: z.string().min(3, 'Address is required'),
  membership_start_date: z.string().optional(),
  membership_end_date: z.string().optional(),
  valid_till: z.string().optional(),
  payment_status: z.string(),
  amount_paid: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(0),
  renewal_date: z.string().optional(),
  notes: z.string().optional(),
})

export function MemberForm({ defaultValues, membershipTypes = [], onSubmit }) {
  const normalizedTypes = useMemo(
    () => membershipTypes.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean),
    [membershipTypes]
  )

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    reset({
      ...defaultValues,
      membership_type: defaultValues.membership_type || normalizedTypes[0] || '',
    })
  }, [defaultValues, normalizedTypes, reset])

  const totalAmount = Number(watch('total_amount') || 0)
  const amountPaid = Number(watch('amount_paid') || 0)
  const dueAmount = totalAmount - amountPaid

  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      membership_start_date: cleanDate(data.membership_start_date),
      membership_end_date: cleanDate(data.membership_end_date),
      valid_till: cleanDate(data.valid_till),
      renewal_date: cleanDate(data.renewal_date),
    })
  }

  return (
    <Card>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <div>
          <p className='text-sm text-muted'>Member profile</p>
          <h3 className='text-xl font-semibold'>Add / update member</h3>
        </div>
        <div className='rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger'>
          Due auto-calculates: ₹{dueAmount.toLocaleString('en-IN')}
        </div>
      </div>

      <form
        key={normalizedTypes.join('|')}
        className='grid gap-4 md:grid-cols-2'
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Field label='Full Name' error={errors.full_name?.message}>
          <Input placeholder='e.g. Aarav Mehta' {...register('full_name')} />
        </Field>

        <Field label='Membership Type' error={errors.membership_type?.message}>
          <select
            className='h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-text'
            {...register('membership_type')}
          >
            <option value=''>Select membership type</option>
            {membershipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label='Email' error={errors.email?.message}>
          <Input type='email' placeholder='member@email.com' {...register('email')} />
        </Field>

        <Field label='Phone Number' error={errors.phone_number?.message}>
          <Input placeholder='10-digit number' {...register('phone_number')} />
        </Field>

        <Field label='Address' error={errors.address?.message}>
          <Input placeholder='City, State' {...register('address')} />
        </Field>

        <Field label='Payment Status'>
          <select
            className='h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-text'
            {...register('payment_status')}
          >
            <option value='Paid'>Paid</option>
            <option value='Pending'>Pending</option>
            <option value='Partial'>Partial</option>
            <option value='Exempted'>Exempted</option>
            <option value='Lifetime'>Lifetime</option>
          </select>
        </Field>

        <Field label='Membership Start Date'>
          <Input type='date' {...register('membership_start_date')} />
        </Field>

        <Field label='Membership End Date'>
          <Input type='date' {...register('membership_end_date')} />
        </Field>

        <Field label='Valid Till'>
          <Input type='date' {...register('valid_till')} />
        </Field>

        <Field label='Renewal Date'>
          <Input type='date' {...register('renewal_date')} />
        </Field>

        <Field label='Amount Paid'>
          <Input type='number' placeholder='0' {...register('amount_paid')} />
        </Field>

        <Field label='Total Amount'>
          <Input type='number' placeholder='0' {...register('total_amount')} />
        </Field>

        <div className='md:col-span-2'>
          <Field label='Notes'>
            <textarea
              rows='3'
              placeholder='Any additional notes...'
              className='w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60'
              {...register('notes')}
            />
          </Field>
        </div>

        <div className='md:col-span-2 flex justify-end'>
          <Button disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save member'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function Field({ label, error, children }) {
  return (
    <label className='space-y-2 text-sm'>
      <span className='text-muted'>{label}</span>
      {children}
      {error && <span className='block text-xs text-danger'>{error}</span>}
    </label>
  )
}