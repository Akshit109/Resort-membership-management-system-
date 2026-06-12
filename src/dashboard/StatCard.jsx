import { Card } from '../components/ui/card'

export function StatCard({ title, value, hint }) {
  return (
    <Card className='bg-luxury'>
      <p className='text-sm text-muted'>{title}</p>
      <h3 className='mt-3 text-3xl font-bold tracking-tight'>{value}</h3>
      <p className='mt-2 text-xs text-accent/80'>{hint}</p>
    </Card>
  )
}