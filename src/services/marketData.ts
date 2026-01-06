import { supabase } from '../utils/supabase/client'

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface PriceCache {
  [symbol: string]: { price: number; timestamp: number }
}

const priceCache: PriceCache = {}

export async function fetchStockPrice(symbol: string): Promise<number> {
  // Check cache first
  const cached = priceCache[symbol]
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}` 
    )
    const data = await response.json()
    
    if (data.c && data.c > 0) {
      priceCache[symbol] = { price: data.c, timestamp: Date.now() }
      return data.c
    }
    
    throw new Error('Invalid price data')
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error)
    // Return cached price if available, otherwise return 0
    return cached?.price || 0
  }
}

export async function updatePortfolioPrices(portfolioId: string) {
  const { data: positions } = await supabase
    .from('portfolio_positions')
    .select('id, symbol')
    .eq('portfolio_id', portfolioId)

  if (!positions) return

  for (const position of positions) {
    try {
      const price = await fetchStockPrice(position.symbol)
      if (price > 0) {
        await supabase
          .from('portfolio_positions')
          .update({ current_price: price })
          .eq('id', position.id)
      }
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to update ${position.symbol}:`, error)
    }
  }
}
