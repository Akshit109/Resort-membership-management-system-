import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none placeholder:text-muted focus:border-accent/60',
        className
      )}
      {...props}
    />
  )
}