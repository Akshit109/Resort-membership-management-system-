import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-accent text-black hover:bg-accent/90',
  secondary: 'bg-white/5 text-text border border-white/10 hover:bg-white/10',
  ghost: 'text-text hover:bg-white/5',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

export function Button({ className, variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}