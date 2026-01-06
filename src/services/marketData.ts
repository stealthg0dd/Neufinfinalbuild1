import { supabase } from '../utils/supabase/client'
import { fetchStockQuote } from '../utils/stockService'

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
    const quote = await fetchStockQuote(symbol)
    if (quote?.price && quote.price > 0) {
      priceCache[symbol] = { price: quote.price, timestamp: Date.now() }
      return quote.price
    }

    throw new Error(quote?.reason || 'Invalid price data')
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
