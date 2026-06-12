import { cn, paymentTone } from '../../lib/utils'

export function Badge({ children, className, tone = 'Paid' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        paymentTone[tone] || 'border-white/10 bg-white/5 text-text',
        className
      )}
    >
      {children}
    </span>
  )
}