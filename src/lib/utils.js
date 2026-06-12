import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const currency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export const formatDate = (value) => {
  if (!value) return '—'
  try {
    return format(new Date(value), 'dd MMM yyyy')
  } catch {
    return '—'
  }
}

export const paymentTone = {
  Paid: 'text-success border-success/20 bg-success/10',
  Pending: 'text-danger border-danger/20 bg-danger/10',
  Partial: 'text-warning border-warning/20 bg-warning/10',
  Exempted: 'text-blue-300 border-blue-400/20 bg-blue-400/10',
  Lifetime: 'text-accent border-accent/20 bg-accent/10',
}