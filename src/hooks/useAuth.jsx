import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, hasSupabaseEnv } from '../supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoSession, setDemoSession] = useState(null)

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({
    session,
    demoSession,
    loading,
    isAuthenticated: hasSupabaseEnv ? Boolean(session) : Boolean(demoSession),
    async login(email, password) {
      if (!hasSupabaseEnv) {
        // Demo mode: allow any credentials
        if (!email || !password) return { error: { message: 'Email and password required' } }
        setDemoSession({ email, password })
        return { error: null }
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    },
    async logout() {
      if (!hasSupabaseEnv) {
        setDemoSession(null)
        return
      }
      await supabase.auth.signOut()
    },
  }), [session, demoSession, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)