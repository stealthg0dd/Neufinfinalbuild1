import { useQuery } from '@tanstack/react-query'
import { supabase } from '../utils/supabase/client'
import { analyzeBiases } from '../services/biasDetection'

export function usePortfolio(userId: string) {
  return useQuery({
    queryKey: ['portfolio', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          portfolio_positions (*)
        `)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useBiasScores(userId: string) {
  return useQuery({
    queryKey: ['bias-scores', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bias_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        // No bias scores yet - return mock data
        return {
          alpha_score: 65,
          loss_aversion_score: 45,
          confirmation_bias_score: 38,
          herding_behavior_score: 52,
          anchoring_bias_score: 30,
          recency_bias_score: 25,
          overconfidence_score: 40,
          disposition_effect_score: 35,
          missed_alpha_dollars: 2840,
        }
      }
      return data
    },
    enabled: !!userId,
  })
}

export function useBiasAnalysis(userId: string, positions?: any[]) {
  return useQuery({
    queryKey: ['bias-analysis', userId, positions?.length],
    queryFn: async () => {
      if (!positions || positions.length === 0) {
        return null
      }

      // Transform positions to match bias detection interface
      const transformedPositions = positions.map(pos => ({
        symbol: pos.symbol,
        shares: pos.shares,
        cost_basis: pos.cost_basis,
        current_price: pos.current_price || pos.cost_basis,
        purchase_date: pos.purchase_date || new Date().toISOString(),
      }))

      return await analyzeBiases(userId, transformedPositions)
    },
    enabled: !!userId && !!positions && positions.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
