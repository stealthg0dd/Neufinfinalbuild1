import { supabase } from '../utils/supabase/client'

export async function createLinkToken(userId: string) {
  // Call Supabase Edge Function (we'll create this later)
  const { data, error } = await supabase.functions.invoke('plaid-create-link-token', {
    body: { userId }
  })
  
  if (error) throw error
  return data.link_token
}

export async function exchangePublicToken(publicToken: string, userId: string) {
  const { data, error } = await supabase.functions.invoke('plaid-exchange-token', {
    body: { publicToken, userId }
  })
  
  if (error) throw error
  return data
}

// For MVP, use direct API calls (temporary)
export async function saveManualPortfolio(
  userId: string,
  positions: Array<{ symbol: string; shares: number; costBasis: number; purchaseDate?: string }>
) {
  // Create portfolio
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .insert({
      user_id: userId,
      name: 'Manual Portfolio',
      is_synced: false,
    })
    .select()
    .single()

  if (portfolioError) throw portfolioError

  // Insert positions
  const positionsData = positions.map(p => ({
    portfolio_id: portfolio.id,
    symbol: p.symbol.toUpperCase(),
    shares: p.shares,
    cost_basis: p.costBasis,
    purchase_date: p.purchaseDate || null,
    current_price: p.costBasis, // Will be updated by market data service
  }))

  const { error: positionsError } = await supabase
    .from('portfolio_positions')
    .insert(positionsData)

  if (positionsError) throw positionsError

  return portfolio
}
