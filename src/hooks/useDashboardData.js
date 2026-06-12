import { useCallback, useEffect, useState } from 'react'
import {
  fetchActivities,
  fetchMembers,
  fetchMembershipTypes,
  fetchPayments,
  buildChartData,
  buildDashboardStats,
  getDueMembers,
} from '../services/memberService'

export function useDashboardData() {
  const [state, setState] = useState({
    members: [],
    payments: [],
    membershipTypes: [],
    activities: [],
    stats: {},
    charts: {
      membershipDistribution: [],
      revenueByStatus: [],
      dueAnalytics: [],
      monthlyGrowth: [],
    },
    dueMembers: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const [membersRaw, payments, membershipTypes, activities] = await Promise.all([
        fetchMembers(),
        fetchPayments(),
        fetchMembershipTypes(),
        fetchActivities(),
      ])

      const members = [...(membersRaw || [])].sort((a, b) =>
        String(a.full_name || '').localeCompare(String(b.full_name || ''))
      )

      setState({
        members,
        payments,
        membershipTypes,
        activities,
        stats: buildDashboardStats(members, payments),
        charts: buildChartData(members, payments),
        dueMembers: getDueMembers(members),
        loading: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data.',
      }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    ...state,
    refetch: load,
  }
}