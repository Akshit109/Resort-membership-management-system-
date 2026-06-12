import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('glass-card rounded-[24px] p-5', className)}
      {...props}
    />
  )
}