import { addDays, isBefore, isWithinInterval, startOfDay, differenceInCalendarDays } from 'date-fns'
import { members as fallbackMembers, payments as fallbackPayments, activities as fallbackActivities, membershipTypes as fallbackTypes } from './mockData'
import { supabase, hasSupabaseEnv } from '../supabase/client'

const today = startOfDay(new Date())

const normalizeMember = (m) => ({
  ...m,
  due_amount: Number(m.total_amount || 0) - Number(m.amount_paid || 0),
})

export async function fetchMembers() {
  if (!hasSupabaseEnv) return fallbackMembers.map(normalizeMember)
  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(normalizeMember)
}

export async function fetchPayments() {
  if (!hasSupabaseEnv) return fallbackPayments
  const { data, error } = await supabase.from('payments').select('*, members(full_name)').order('created_at', { ascending: false })
  if (error) throw error
  return data
}
export async function fetchMembershipTypes() {
  const { data, error } = await supabase
    .from('membership_types')
    .select('name')
    .order('name', { ascending: true })
  if (error) throw error
  return data?.map((row) => row.name) || []
}

export async function fetchActivities() {
  if (!hasSupabaseEnv) return fallbackActivities
  const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10)
  if (error) throw error
  return data
}

function cleanDate(value) {
  if (!value) return null
  const s = String(value).trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}
export async function upsertMember(payload) {
  const record = normalizeMember(cleanDates(payload))
  if (!hasSupabaseEnv) return record
  const { data, error } = await supabase.from('members').upsert(record).select().single()
  if (error) throw error
  return data
}

export async function removeMember(id) {
  if (!hasSupabaseEnv) return true
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function upsertPayment(payload) {
  if (!hasSupabaseEnv) return payload
  const { data, error } = await supabase.from('payments').upsert(payload).select().single()
  if (error) throw error
  return data
}

export function buildDashboardStats(members = [], payments = []) {
  const expiringSoon = members.filter((m) =>
    m.valid_till && isWithinInterval(new Date(m.valid_till), { start: today, end: addDays(today, 30) })
  )
  const expired = members.filter((m) =>
    m.valid_till && isBefore(new Date(m.valid_till), today)
  )
  const active = members.filter((m) =>
    m.lifetime_status || (m.valid_till && !isBefore(new Date(m.valid_till), today))
  )
  const lifetime = members.filter((m) => m.lifetime_status)
  const revenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const totalDue = members.reduce((sum, m) => sum + Number(m.due_amount || 0), 0)
  const pending = members.filter((m) => ['Pending', 'Partial'].includes(m.payment_status))

  return {
    totalMembers: members.length,
    activeMembers: active.length,
    expiredMembers: expired.length,
    lifetimeMembers: lifetime.length,
    totalRevenue: revenue,
    totalDueAmount: totalDue,
    pendingPayments: pending.length,
    expiringSoon: expiringSoon.length,
  }
}

export function buildChartData(members = [], payments = []) {
  const membershipDistribution = Object.entries(
    members.reduce((acc, m) => {
      acc[m.membership_type] = (acc[m.membership_type] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const revenueByStatus = ['Paid', 'Partial', 'Pending', 'Lifetime', 'Exempted'].map((status) => ({
    status,
    amount: payments.filter((p) => p.status === status).reduce((sum, p) => sum + Number(p.amount || 0), 0),
  }))

  const dueAnalytics = members
    .filter((m) => Number(m.due_amount) > 0)
    .map((m) => ({ name: m.full_name, due: Number(m.due_amount) }))

  const monthlyGrowth = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
    const label = month.toLocaleString('en-IN', { month: 'short' })
    const count = members.filter((m) => {
      const created = m.created_at ? new Date(m.created_at) : null
      return created && created.getMonth() === month.getMonth() && created.getFullYear() === month.getFullYear()
    }).length
    return { month: label, members: count, revenue: count * 45000 }
  })

  return { membershipDistribution, revenueByStatus, dueAnalytics, monthlyGrowth }
}

export function getDueMembers(members = []) {
  return members.filter((m) =>
    Number(m.due_amount) > 0 ||
    (m.valid_till && differenceInCalendarDays(new Date(m.valid_till), today) <= 0)
  )
}

export async function importMembersFromCsvRows(rows) {
  if (!rows?.length) return

 const payload = rows.map((row) => ({
  full_name: row.full_name || '',
  membership_type: row.membership_type || '',
  email: row.email || '',
  phone_number: row.phone_number || '',
  address: row.address || '',
  membership_start_date: cleanDate(row.membership_start_date),
  membership_end_date: cleanDate(row.membership_end_date),
  valid_till: cleanDate(row.valid_till),
  payment_status: row.payment_status || 'Pending',
  amount_paid: Number(row.amount_paid || 0),
  total_amount: Number(row.total_amount || 0),
  renewal_date: cleanDate(row.renewal_date),
  notes: row.notes || '',
}))
  const { error } = await supabase.from('members').insert(payload, { returning: 'minimal' })
  if (error) throw error
}