import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/portfolio-setup')
      } else {
        navigate('/login')
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
}